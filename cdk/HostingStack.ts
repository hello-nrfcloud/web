import {
	App,
	aws_certificatemanager as certificatemanager,
	aws_cloudfront as Cf,
	aws_iam as IAM,
	aws_lambda as Lambda,
	aws_s3 as S3,
	CfnOutput,
	Duration,
	RemovalPolicy,
	Stack,
} from 'aws-cdk-lib'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { readFileSync } from 'fs'
import path from 'path'

export class HostingStack extends Stack {
	public constructor(
		parent: App,
		stackName: string,
		{
			repository: r,
			allowedClients,
			domainName,
			region,
			certificateId,
		}: {
			repository: {
				owner: string
				repo: string
			}
			allowedClients: string[]
			domainName: string
			certificateId: string
			region: string
		},
	) {
		super(parent, stackName, {
			env: {
				region,
			},
		})

		const websiteBucket = new S3.Bucket(this, 'bucket', {
			autoDeleteObjects: true,
			removalPolicy: RemovalPolicy.DESTROY,
		})

		const githubDomain = 'token.actions.githubusercontent.com'
		const ghProvider = new IAM.OpenIdConnectProvider(this, 'githubProvider', {
			url: `https://${githubDomain}`,
			clientIds: ['sts.amazonaws.com'],
		})

		const ghRole = new IAM.Role(this, 'ghRole', {
			roleName: `${stackName}-cd`,
			assumedBy: new IAM.WebIdentityPrincipal(
				ghProvider.openIdConnectProviderArn,
				{
					StringLike: {
						[`${githubDomain}:sub`]: `repo:${r.owner}/${r.repo}:saga`,
					},
				},
			),
			description: `This role is used by GitHub Actions to deploy the website of ${stackName}`,
			maxSessionDuration: Duration.hours(1),
		})

		websiteBucket.grantWrite(ghRole)

		const clientAuthorizer = new Cf.experimental.EdgeFunction(
			this,
			'IPAuthorizerLambda',
			{
				runtime: Lambda.Runtime.NODEJS_18_X,
				handler: 'index.handler',
				code: Lambda.Code.fromInline(
					readFileSync(
						path.join(process.cwd(), 'cdk', 'clientAuthorizer.js'),
						'utf-8',
					).replace('%ALLOWED_CLIENTS%', allowedClients.join(',')),
				),
			},
		)

		const oai = new Cf.OriginAccessIdentity(this, 'originAccessIdentity', {
			comment: `OAI for ${domainName} CloudFront distribution.`,
		})
		websiteBucket.grantRead(oai)

		const s3Origin = new S3Origin(websiteBucket, {
			originId: 's3website',
			originPath: '/',
			originAccessIdentity: oai,
		})
		const distribution = new Cf.Distribution(this, 'cloudFront', {
			enabled: true,
			priceClass: Cf.PriceClass.PRICE_CLASS_100,
			defaultRootObject: 'index.html',
			defaultBehavior: {
				allowedMethods: Cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
				cachedMethods: Cf.CachedMethods.CACHE_GET_HEAD,
				compress: true,
				smoothStreaming: false,
				origin: s3Origin,
				viewerProtocolPolicy: Cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				edgeLambdas: [
					{
						functionVersion: clientAuthorizer.currentVersion,
						eventType: Cf.LambdaEdgeEventType.VIEWER_REQUEST,
					},
				],
				cachePolicy: new Cf.CachePolicy(this, 'defaultCachePolicy', {
					defaultTtl: Duration.days(30),
				}),
			},
			enableIpv6: false, // For IP protected access
			domainNames: [domainName],
			certificate: certificatemanager.Certificate.fromCertificateArn(
				this,
				'distributionCert',
				// us-east-1 is required for CloudFront
				`arn:aws:acm:us-east-1:${this.account}:certificate/${certificateId}`,
			),
		})
		distribution.addBehavior('*.html', s3Origin, {
			cachePolicy: new Cf.CachePolicy(this, 'htmlCachePolicy', {
				defaultTtl: Duration.minutes(10),
			}),
		})

		new CfnOutput(this, 'gitHubCdRoleArn', {
			value: ghRole.roleArn,
			exportName: `${this.stackName}:gitHubCdRoleArn`,
		})

		new CfnOutput(this, 'distributionDomainName', {
			value: distribution.distributionDomainName,
			exportName: `${this.stackName}:distributionDomainName`,
		})
	}
}

export type StackOutputs = {
	bucketDomainName: string
	gitHubCdRoleArn: string
}
