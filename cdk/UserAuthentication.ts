import {
	aws_cognito as Cognito,
	aws_iam as IAM,
	RemovalPolicy,
	Stack,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class UserAuthentication extends Construct {
	public readonly authenticatedUserRole: IAM.IRole
	public readonly unauthenticatedUserRole: IAM.IRole
	public readonly identityPool: Cognito.CfnIdentityPool
	public readonly userPool: Cognito.UserPool
	constructor(parent: Stack, id: string) {
		super(parent, id)

		this.userPool = new Cognito.UserPool(this, 'userPool', {
			// Only used for anonymous users, so disable signup
			selfSignUpEnabled: false,
			removalPolicy: RemovalPolicy.DESTROY,
		})

		const userPoolClient = new Cognito.UserPoolClient(this, 'userPoolClient', {
			userPool: this.userPool,
		})
		this.identityPool = new Cognito.CfnIdentityPool(this, 'identityPool', {
			allowUnauthenticatedIdentities: true,
			cognitoIdentityProviders: [
				{
					clientId: userPoolClient.userPoolClientId,
					providerName: this.userPool.userPoolProviderName,
				},
			],
		})

		this.authenticatedUserRole = new IAM.Role(this, 'userRole', {
			assumedBy: new IAM.FederatedPrincipal(
				'cognito-identity.amazonaws.com',
				{
					StringEquals: {
						'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
					},
					'ForAnyValue:StringLike': {
						'cognito-identity.amazonaws.com:amr': 'authenticated',
					},
				},
				'sts:AssumeRoleWithWebIdentity',
			),
			inlinePolicies: {},
		})

		this.unauthenticatedUserRole = new IAM.Role(
			this,
			'unauthenticatedUserRole',
			{
				assumedBy: new IAM.FederatedPrincipal(
					'cognito-identity.amazonaws.com',
					{
						StringEquals: {
							'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
						},
						'ForAnyValue:StringLike': {
							'cognito-identity.amazonaws.com:amr': 'unauthenticated',
						},
					},
					'sts:AssumeRoleWithWebIdentity',
				),
			},
		)

		new Cognito.CfnIdentityPoolRoleAttachment(this, 'identityPoolRoles', {
			identityPoolId: this.identityPool.ref.toString(),
			roles: {
				authenticated: this.authenticatedUserRole.roleArn,
				unauthenticated: this.unauthenticatedUserRole.roleArn,
			},
		})
	}
}
