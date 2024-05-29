import { ListTree, X } from 'lucide-preact'
import { useDevice } from '#context/Device.js'
import {
	type LwM2MObjectInstance,
	definitions,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { formatFloat } from '#utils/format.js'
import { Ago } from './Ago.js'

import './LwM2MDebug.css'

export const LwM2MDebug = () => {
	const { setDebug, desired, reported } = useDevice()
	return (
		<aside class="lwm2m-debug bg-dark">
			<header>
				<h1>
					<ListTree /> LwM2M Objects
				</h1>
				<button type="button" onClick={() => setDebug(false)}>
					<X />
				</button>
			</header>
			<p class="mt-2">
				Device information is encoded as LwM2M objects, which are defined in{' '}
				<a
					href={`https://github.com/hello-nrfcloud/proto-map/blob/v${PROTO_MAP_VERSION}/`}
					target={'_blank'}
				>
					this repository
				</a>
				. Below are the objects for this device.
			</p>
			<h2 class="mt-2">Reported</h2>
			{Object.values(reported).length === 0 && <p>No reported state</p>}
			{Object.values(reported).map((instance) => (
				<ShowInstance instance={instance} />
			))}
			<h2 class="mt-2">Desired</h2>
			{Object.values(desired).length === 0 && <p>No desired state</p>}
			{Object.values(desired).map((instance) => (
				<ShowInstance instance={instance} />
			))}
		</aside>
	)
}

const ShowInstance = ({ instance }: { instance: LwM2MObjectInstance }) => {
	return (
		<>
			<h3>
				<span>
					{instance.ObjectID}/{instance.ObjectInstanceID ?? '0'} (
					<a
						href={`https://github.com/hello-nrfcloud/proto-map/blob/v${PROTO_MAP_VERSION}/lwm2m/${instance.ObjectID}.xml`}
						target="_blank"
					>
						{definitions[instance.ObjectID].Name}
					</a>
					)
				</span>
				<Ago date={new Date(instance.Resources['99'] as number)} />
			</h3>
			<dl>
				{Object.entries(instance.Resources).map(([ResourceID, value]) => {
					const info =
						definitions[instance.ObjectID].Resources[parseInt(ResourceID, 10)]
					return (
						<>
							<dt>{ResourceID}</dt>
							<dd>
								{info?.Type === 'Float' && typeof value === 'number'
									? formatFloat(value)
									: value}{' '}
								<small>{info?.Name ?? '??'}</small>
							</dd>
						</>
					)
				})}
			</dl>
		</>
	)
}
