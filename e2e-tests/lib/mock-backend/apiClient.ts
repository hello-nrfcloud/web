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
}
