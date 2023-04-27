import { aws_iam as IAM, aws_location as Location, Stack } from 'aws-cdk-lib'
import type { CfnMap } from 'aws-cdk-lib/aws-location'
import { Construct } from 'constructs'
import type { UserAuthentication } from './UserAuthentication.js'

export class Map extends Construct {
	public readonly map: CfnMap
	public readonly mapName: string

	constructor(
		parent: Stack,
		id: string,
		{
			userAuthentication,
			domainName,
		}: {
			userAuthentication: UserAuthentication
			domainName: string
		},
	) {
		super(parent, id)

		this.mapName = `${parent.stackName}-map`
		this.map = new Location.CfnMap(this, 'mapDark', {
			mapName: this.mapName,
			description: 'Provides the map tiles (Esri Dark Gray Canvas)',
			configuration: {
				style: 'VectorEsriDarkGrayCanvas',
			},
		})

		userAuthentication.unauthenticatedUserRole.addToPrincipalPolicy(
			new IAM.PolicyStatement({
				actions: ['geo:GetMap*'],
				resources: [this.map.attrArn],
				conditions: {
					StringLike: {
						'aws:referer': [`https://${domainName}/*`, 'http://localhost:*/*'],
					},
				},
			}),
		)
	}
}
