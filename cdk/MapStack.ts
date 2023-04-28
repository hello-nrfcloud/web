import { App, CfnOutput, Stack } from 'aws-cdk-lib'
import { MapResources } from './MapResources.js'
import { UserAuthentication } from './UserAuthentication.js'

export class MapStack extends Stack {
	public constructor(
		parent: App,
		stackName: string,
		{
			domainName,
			region,
		}: {
			domainName: string
			region: string
		},
	) {
		super(parent, stackName, {
			env: {
				region,
			},
		})

		// Add resources to render maps
		const userAuthentication = new UserAuthentication(this, 'users')
		const map = new MapResources(this, 'map', {
			domainName,
			userAuthentication,
		})

		new CfnOutput(this, 'mapName', {
			value: map.mapName,
			exportName: `${this.stackName}:mapName`,
		})

		new CfnOutput(this, 'identityPoolId', {
			value: userAuthentication.identityPool.ref,
			exportName: `${this.stackName}:identityPoolId`,
		})
	}
}

export type StackOutputs = {
	mapName: string
	identityPoolId: string
}
