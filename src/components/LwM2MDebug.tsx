import { ListTree, SquareStack, X } from 'lucide-preact'
import { useDevice } from '#context/Device.js'
import {
	type LwM2MObjectInstance,
	definitions,
	instanceTsAsDate,
	type LwM2MObjectID,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { formatFloat } from '#utils/format.js'
import { Ago } from './Ago.js'
import cx from 'classnames'

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
			{Object.values(reported).length !== 0 && (
				<ShowObjects objects={Object.values(reported)} />
			)}
			<h2 class="mt-2">Desired</h2>
			{Object.values(desired).length === 0 && <p>No desired state</p>}
			{Object.values(desired).length !== 0 && (
				<ShowObjects objects={Object.values(desired)} />
			)}
		</aside>
	)
}

const byInstanceId = (i1: LwM2MObjectInstance, i2: LwM2MObjectInstance) =>
	(i1.ObjectInstanceID ?? 0) - (i2.ObjectInstanceID ?? 0)

const ShowObjects = ({ objects }: { objects: LwM2MObjectInstance[] }) => {
	const objectIds = [...new Set(objects.map((instance) => instance.ObjectID))]
	return (
		<>
			{objectIds
				.sort((a, b) => a - b)
				.map((ObjectID) => (
					<>
						<ObjectHeader ObjectID={ObjectID} />
						{objects
							.filter((instance) => instance.ObjectID === ObjectID)
							.sort(byInstanceId)
							.map((instance) => (
								<ShowInstance instance={instance} />
							))}
					</>
				))}
		</>
	)
}

const ObjectHeader = ({ ObjectID }: { ObjectID: LwM2MObjectID }) => (
	<h3>
		<a
			href={`https://github.com/hello-nrfcloud/proto-map/blob/v${PROTO_MAP_VERSION}/lwm2m/${ObjectID}.xml`}
			target="_blank"
		>
			{definitions[ObjectID].Name}
		</a>
	</h3>
)

const ShowInstance = ({ instance }: { instance: LwM2MObjectInstance }) => {
	const ts = instanceTsAsDate(instance)
	return (
		<div class="mb-4">
			<h4 class="d-flex justify-content-between">
				<span>
					<SquareStack strokeWidth={1} class="me-1" />
					{instance.ObjectID}/{instance.ObjectInstanceID ?? '0'}
				</span>
				<Ago date={ts} key={ts.toISOString()} />
			</h4>
			<dl class="ms-2">
				{Object.entries(instance.Resources).map(([ResourceID, value]) => {
					const info =
						definitions[instance.ObjectID].Resources[parseInt(ResourceID, 10)]
					return (
						<>
							<dt>{ResourceID}</dt>
							<dd>
								<ShowResource info={info} value={value} />
							</dd>
						</>
					)
				})}
			</dl>
		</div>
	)
}

const ShowResource = ({
	info,
	value,
}: {
	info: LwM2MResourceInfo | undefined
	value: LwM2MResourceValue | undefined
}) => {
	if (value === undefined) return <span>&mdash;</span>
	return (
		<>
			{info?.Multiple === true &&
				Array.isArray(value) &&
				value.map((v, k) => (
					<>
						<small>{k}:</small>
						<ShowValue class="ms-1 me-1" value={v} info={info} />
					</>
				))}
			{info?.Multiple !== true && <ShowValue value={value} info={info} />}
			{info?.Units !== undefined && (
				<span class="units ms-1">{info.Units}</span>
			)}
			<small class="name ms-1">{info?.Name ?? '??'}</small>
		</>
	)
}

const ShowValue = ({
	value,
	info,
	class: className,
}: {
	value: LwM2MResourceValue
	info?: LwM2MResourceInfo
	class?: string
}) => (
	<span class={cx('value', info?.Type, className)}>
		{info?.Type === 'Float' && typeof value === 'number'
			? formatFloat(value)
			: value}
	</span>
)
