import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.ts'
import { type Model } from '#content/models/types.ts'

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
