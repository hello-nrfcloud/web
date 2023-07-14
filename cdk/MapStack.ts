import { App, CfnOutput, Stack } from 'aws-cdk-lib'
import { MapResources } from './MapResources.js'

export class MapStack extends Stack {
	public constructor(parent: App, stackName: string) {
		super(parent, stackName)

		// Add resources to render maps
		const map = new MapResources(this, 'map')

		new CfnOutput(this, 'mapName', {
			value: map.mapName,
			exportName: `${this.stackName}:mapName`,
		})
	}
}

export type StackOutputs = {
	mapName: string
}
