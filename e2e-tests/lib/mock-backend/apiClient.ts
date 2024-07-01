import type { LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'

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
		state: Array<LwM2MObjectInstance>,
	): Promise<void> => {
		await fetch(new URL(`/api/devices/${deviceId}/state`, base), {
			method: 'PUT',
			body: JSON.stringify(state),
		})
	},
}
