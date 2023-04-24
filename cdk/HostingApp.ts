import { App } from 'aws-cdk-lib'
import { HostingStack } from './HostingStack.js'

export class HostingApp extends App {
	public constructor(
		stackName: string,
		props: ConstructorParameters<typeof HostingStack>[2],
	) {
		super()
		new HostingStack(this, stackName, props)
	}
}
