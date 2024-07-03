import type { LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { objectsToShadow } from '@hello.nrfcloud.com/proto-map/lwm2m/aws'
import type { SIMUsage } from './context.js'

const base = new URL('http://localhost:8080')

export const apiClient = {
	setRelease: async (release: string): Promise<void> => {
		await fetch(new URL('/api/release', base), {
			method: 'PUT',
			body: release,
		})
	},
	registerDevice: async (
		model: string,
		lastSeen?: Date,
	): Promise<{ id: string; fingerprint: string }> => {
		const { id, fingerprint } = await (
			await fetch(new URL('/api/devices', base), {
				method: 'POST',
				body: JSON.stringify({
					model,
					lastSeen: lastSeen?.toISOString(),
				}),
			})
		).json()
		return {
			id,
			fingerprint,
		}
	},
	updateState: async (
		deviceId: string,
		state: {
			reported?: Record<string, any>
			desired?: Record<string, any>
		},
	): Promise<void> => {
		await fetch(new URL(`/api/devices/state/${deviceId}`, base), {
			method: 'PUT',
			body: JSON.stringify(state),
		})
	},
	report: async (
		deviceId: string,
		objects: Array<LwM2MObjectInstance>,
	): Promise<void> => {
		await apiClient.updateState(deviceId, {
			reported: objectsToShadow(objects),
		})
	},
	setSIMDetails: async (iccid: string, details: SIMUsage): Promise<void> => {
		await fetch(new URL(`/api/simDetails/${iccid}`, base), {
			method: 'PUT',
			body: JSON.stringify(details),
		})
	},
}
