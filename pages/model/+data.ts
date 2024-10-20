import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'
import { type Model } from '#content/models/types.js'
import type { PageContextClient } from 'vike/types'

export type ModelPageProps = { model: Model; pageTitle: string }

export const data = async (
	pageContext: PageContextClient,
): Promise<ModelPageProps> => {
	const modelId = pageContext.routeParams?.model
	if (modelId === undefined) throw new Error(`No model ID provided!`)
	const model = (await loadModelsFromMarkdown)[modelId]
	if (model === undefined) throw new Error(`Could not find model: ${modelId}!`)

	return {
		model: {
			...model,
			slug: modelId,
		},
		pageTitle: `${model.title} (${modelId})`,
	}
}
