import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'

export const instanceKey = (
	ObjectID: LwM2MObjectInstance['ObjectID'],
	ObjectInstanceID: LwM2MObjectInstance['ObjectInstanceID'] = 0,
): string => `${ObjectID}/${ObjectInstanceID}`

/**
 * Merge partial updates into a full LwM2M object instance
 */
export const mergeInstances =
	(instances: Array<LwM2MObjectInstance>) =>
	(
		current: Record<string, LwM2MObjectInstance>,
	): Record<string, LwM2MObjectInstance> =>
		instances.reduce<Record<string, LwM2MObjectInstance>>(
			(acc, instance) => {
				const old =
					acc[instanceKey(instance.ObjectID, instance.ObjectInstanceID)]
				acc[instanceKey(instance.ObjectID, instance.ObjectInstanceID)] = {
					...(old ?? {}),
					...instance,
					Resources: {
						...(old?.Resources ?? {}),
						...instance.Resources,
					},
				}
				return acc
			},
			{ ...current },
		)
