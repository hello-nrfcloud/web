import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'
import { type Model } from '#content/models/types.js'

export type IndexPageProps = { models: Record<string, Model> }

export const data = async (): Promise<IndexPageProps> => ({
	models: Object.values(await loadModelsFromMarkdown).reduce(
		(acc, model) => ({
			...acc,
			[model.slug]: model,
		}),
		{},
	),
})
