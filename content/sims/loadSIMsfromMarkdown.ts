import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Type } from '@sinclair/typebox'
import { loadMarkdownContent } from '../../pages/loadMarkdownContent.ts'
import { IncludedSIM, type IncludedSIMType } from './types.ts'

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
