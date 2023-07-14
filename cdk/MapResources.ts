import { aws_location as Location, Stack } from 'aws-cdk-lib'
import type { CfnMap } from 'aws-cdk-lib/aws-location'
import { Construct } from 'constructs'

export class MapResources extends Construct {
	public readonly map: CfnMap
	public readonly mapName: string

	constructor(parent: Stack, id: string) {
		super(parent, id)

		this.mapName = `${parent.stackName}-map`
		this.map = new Location.CfnMap(this, 'mapDark', {
			mapName: this.mapName,
			description: 'Provides the map tiles (Esri Dark Gray Canvas)',
			configuration: {
				style: 'VectorEsriDarkGrayCanvas',
			},
		})
	}
}
