import { generateFingerprint } from '#utils/generateFingerprint.js'
import { generateIMEI } from '#utils/generateIMEI.js'

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
	): Promise<{ id: string; fingerprint: string }> => {
		const id = `oob-${generateIMEI()}`
		const fingerprint = generateFingerprint()
		await fetch(new URL('/api/devices', base), {
			method: 'POST',
			body: JSON.stringify({
				id,
				fingerprint,
				model,
			}),
		})
		return {
			id,
			fingerprint,
		}
	},
}
