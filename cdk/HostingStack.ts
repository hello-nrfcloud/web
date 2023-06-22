import {
	App,
	aws_certificatemanager as CertificateManager,
	aws_cloudfront as Cf,
	aws_cloudfront_origins as CfOrigins,
	CfnOutput,
	Duration,
	aws_iam as IAM,
	aws_lambda as Lambda,
	RemovalPolicy,
	aws_s3 as S3,
	Stack,
} from 'aws-cdk-lib'
import { readFileSync } from 'fs'
import path from 'path'

export class HostingStack extends Stack {
	public constructor(
		parent: App,
		stackName: string,
		{
			repository: r,
			region,
			customDomain,
			gitHubOICDProviderArn,
		}: {
			repository: {
				owner: string
				repo: string
			}
			gitHubOICDProviderArn: string
			customDomain?: {
				domainName: string
				certificateId: string
			}
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
			publicReadAccess: true,
			websiteIndexDocument: 'index.html',
			blockPublicAccess: {
				blockPublicAcls: false,
				ignorePublicAcls: false,
				restrictPublicBuckets: false,
				blockPublicPolicy: false,
			},
			objectOwnership: S3.ObjectOwnership.OBJECT_WRITER,
		})

		const gitHubOIDC = IAM.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
			this,
			'gitHubOICDProvider',
			gitHubOICDProviderArn,
		)

		const ghRole = new IAM.Role(this, 'ghRole', {
			roleName: `${stackName}-cd`,
			assumedBy: new IAM.WebIdentityPrincipal(
				gitHubOIDC.openIdConnectProviderArn,
				{
					StringEquals: {
						[`token.actions.githubusercontent.com:sub`]: `repo:${r.owner}/${r.repo}:environment:production`,
						[`token.actions.githubusercontent.com:aud`]: 'sts.amazonaws.com',
					},
				},
			),
			description: `This role is used by GitHub Actions to deploy the website of ${stackName}`,
			maxSessionDuration: Duration.hours(1),
		})

		websiteBucket.grantReadWrite(ghRole)

		// Allow to describe this stack (to see outputs)
		ghRole.addToPolicy(
			new IAM.PolicyStatement({
				actions: ['cloudformation:DescribeStacks'],
				resources: [this.stackId],
			}),
		)

		const fingerprintRedirect = new Cf.experimental.EdgeFunction(
			this,
			'fingerprintRedirect',
			{
				runtime: Lambda.Runtime.NODEJS_18_X,
				handler: 'index.handler',
				description: 'Redirects QR code URLs',
				code: Lambda.Code.fromInline(
					readFileSync(
						path.join(process.cwd(), 'cdk', 'fingerprint.js'),
						'utf-8',
					),
				),
			},
		)

		const oai = new Cf.OriginAccessIdentity(this, 'originAccessIdentity', {
			comment: `OAI for hello.nrfcloud.com CloudFront distribution.`,
		})
		websiteBucket.grantRead(oai)

		const s3Origin = new CfOrigins.S3Origin(websiteBucket, {
			originId: 's3website',
			originPath: '/',
			originAccessIdentity: oai,
		})

		const defaultBehaviour: Cf.AddBehaviorOptions = {
			allowedMethods: Cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
			cachedMethods: Cf.CachedMethods.CACHE_GET_HEAD,
			compress: true,
			smoothStreaming: false,
			viewerProtocolPolicy: Cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			edgeLambdas: [
				{
					functionVersion: fingerprintRedirect.currentVersion,
					eventType: Cf.LambdaEdgeEventType.VIEWER_REQUEST,
				},
			],
			cachePolicy: new Cf.CachePolicy(this, 'defaultCachePolicy', {
				defaultTtl: Duration.minutes(10),
				enableAcceptEncodingBrotli: true,
				enableAcceptEncodingGzip: true,
			}),
		}

		const staticFileBehaviour: Cf.AddBehaviorOptions = {
			...defaultBehaviour,
			cachePolicy: new Cf.CachePolicy(this, 'staticFileBehaviour', {
				defaultTtl: Duration.days(356),
				minTtl: Duration.days(356),
				// Allow cache busting
				queryStringBehavior: Cf.CacheQueryStringBehavior.allowList('v'),
			}),
			edgeLambdas: [],
		}

		const distribution = new Cf.Distribution(this, 'cloudFront', {
			enabled: true,
			priceClass: Cf.PriceClass.PRICE_CLASS_100,
			defaultRootObject: 'index.html',
			defaultBehavior: {
				origin: s3Origin,
				...defaultBehaviour,
			},
			domainNames:
				customDomain === undefined ? undefined : [customDomain.domainName],
			certificate:
				customDomain === undefined
					? undefined
					: CertificateManager.Certificate.fromCertificateArn(
							this,
							'distributionCert',
							// us-east-1 is required for CloudFront
							`arn:aws:acm:us-east-1:${this.account}:certificate/${customDomain.certificateId}`,
					  ),
		})
		distribution.addBehavior('*.js', s3Origin, staticFileBehaviour)
		distribution.addBehavior('*.map', s3Origin, staticFileBehaviour)
		distribution.addBehavior('*.css', s3Origin, staticFileBehaviour)
		distribution.addBehavior('*.webp', s3Origin, staticFileBehaviour)
		distribution.addBehavior('*.svg', s3Origin, staticFileBehaviour)
		distribution.addBehavior('*.png', s3Origin, staticFileBehaviour)
		distribution.addBehavior('*.woff2', s3Origin, staticFileBehaviour)

		// Allow CD to create cache invalidation
		distribution.grantCreateInvalidation(ghRole)

		new CfnOutput(this, 'gitHubCdRoleArn', {
			value: ghRole.roleArn,
			exportName: `${this.stackName}:gitHubCdRoleArn`,
		})

		new CfnOutput(this, 'distributionDomainName', {
			value: distribution.distributionDomainName,
			exportName: `${this.stackName}:distributionDomainName`,
		})

		new CfnOutput(this, 'distributionId', {
			value: distribution.distributionId,
			exportName: `${this.stackName}:distributionId`,
		})

		new CfnOutput(this, 'bucketName', {
			value: websiteBucket.bucketName,
			exportName: `${this.stackName}:bucketName`,
		})
	}
}

export type StackOutputs = {
	gitHubCdRoleArn: string
	distributionDomainName: string
	bucketName: string
	distributionId: string
	mapName: string
}
