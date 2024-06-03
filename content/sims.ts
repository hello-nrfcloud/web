import type { IncludedSIM } from '#context/Models.js'
import { loadMarkdownContent } from '../pages/loadMarkdownContent.js'

export type SIMMarkdown = {
	// amount of free data on the shipped SIM in megabytes
	freeMb: number
	html: string
	companyName: string
}

export const sims = (async (): Promise<Record<string, IncludedSIM>> => {
	const simsList = await loadMarkdownContent<SIMMarkdown>('sims')
	return simsList.reduce(
		(sims, sim) => ({
			...sims,
			[sim.slug]: {
				...sim,
				vendor: sim.slug,
			},
		}),
		{} as Record<string, IncludedSIM>,
	)
})()
