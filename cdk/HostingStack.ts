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
			allowedIps,
			domainName,
			region,
			certificateId,
		}: {
			repository: {
				owner: string
				repo: string
			}
			allowedIps: string[]
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
			removalPolicy: RemovalPolicy.DESTROY,
			websiteIndexDocument: 'index.html',
			websiteErrorDocument: '404.html',
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

		const myFunc = new Cf.experimental.EdgeFunction(
			this,
			'IPAuthorizerLambda',
			{
				runtime: Lambda.Runtime.NODEJS_18_X,
				handler: 'index.handler',
				code: Lambda.Code.fromInline(
					readFileSync(
						path.join(process.cwd(), 'cdk', 'ipAuthorizer.js'),
						'utf-8',
					).replace('%ALLOWED_IPS%', allowedIps.join(',')),
				),
			},
		)

		const oai = new Cf.OriginAccessIdentity(this, 'originAccessIdentity', {
			comment: `OAI for ${domainName} CloudFront distribution.`,
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
				origin: new S3Origin(websiteBucket, {
					originAccessIdentity: oai,
				}),
				viewerProtocolPolicy: Cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				edgeLambdas: [
					{
						functionVersion: myFunc.currentVersion,
						eventType: Cf.LambdaEdgeEventType.VIEWER_REQUEST,
					},
				],
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
		// Grant distribution access to bucket
		/*
		websiteBucket.addToResourcePolicy(
			new IAM.PolicyStatement({
				effect: IAM.Effect.ALLOW,
				principals: [new IAM.ServicePrincipal('cloudfront.amazonaws.com')],
				actions: ['s3:GetObject'],
				resources: [websiteBucket.arnForObjects('*')],
				conditions: {
					StringEquals: {
						'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
					},
				},
			}),
		)
		*/

		websiteBucket.addToResourcePolicy(
			new IAM.PolicyStatement({
				effect: IAM.Effect.ALLOW,
				principals: [
					new IAM.ArnPrincipal(
						`arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${oai.originAccessIdentityId}`,
					),
				],
				actions: ['s3:GetObject'],
				resources: [websiteBucket.arnForObjects('*')],
			}),
		)

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
