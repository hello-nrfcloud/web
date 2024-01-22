import { Duration, aws_iam as IAM, Stack } from 'aws-cdk-lib'
import { PolicyDocument } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
export class GitHubRole extends Construct {
	public readonly role: IAM.IRole
	constructor(
		parent: Construct,
		id: string,
		{
			repository: r,
			roleName,
			gitHubOIDC,
		}: {
			roleName: string
			repository: {
				owner: string
				repo: string
			}
			gitHubOIDC: IAM.IOpenIdConnectProvider
		},
	) {
		super(parent, id)

		this.role = new IAM.Role(this, 'role', {
			roleName,
			assumedBy: new IAM.WebIdentityPrincipal(
				gitHubOIDC.openIdConnectProviderArn,
				{
					StringEquals: {
						[`token.actions.githubusercontent.com:sub`]: `repo:${r.owner}/${r.repo}:environment:production`,
						[`token.actions.githubusercontent.com:aud`]: 'sts.amazonaws.com',
					},
				},
			),
			description: `This role is used by GitHub Actions to deploy the website of ${Stack.of(this).stackName}`,
			maxSessionDuration: Duration.hours(1),
			inlinePolicies: {
				describeStack: new PolicyDocument({
					statements: [
						// Allow to describe this stack (to see outputs)
						new IAM.PolicyStatement({
							actions: ['cloudformation:DescribeStacks'],
							resources: [Stack.of(this).stackId],
						}),
					],
				}),
			},
		})
	}
}
