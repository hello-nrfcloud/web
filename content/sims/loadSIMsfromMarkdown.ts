import { Type } from '@sinclair/typebox'
import { loadMarkdownContent } from '../../pages/loadMarkdownContent.js'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { IncludedSIM, type IncludedSIMType } from './types.js'

const v = validateWithTypeBox(Type.Array(IncludedSIM, { minItems: 1 }))

export const loadSIMsfromMarkdown = (async (): Promise<
	Record<string, IncludedSIMType>
> => {
	const maybeSimList = v(await loadMarkdownContent('sims'))
	if ('errors' in maybeSimList) {
		console.error(maybeSimList.errors)
		throw new Error(`Invalid SIMs definition!`)
	}
	return maybeSimList.value.reduce(
		(sims, sim) => ({
			...sims,
			[sim.slug]: {
				...sim,
			},
		}),
		{},
	)
})()
