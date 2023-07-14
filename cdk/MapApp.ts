import { App } from 'aws-cdk-lib'
import { MapStack } from './MapStack.js'

export class MapApp extends App {
	public constructor(stackName: string) {
		super()
		new MapStack(this, stackName)
	}
}
