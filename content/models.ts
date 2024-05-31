import type { Model } from '#context/Models.js'
import { loadMarkdownContent } from '../pages/loadMarkdownContent.js'

export const models = (async (): Promise<Record<string, Model>> => {
	const modelsList = await loadMarkdownContent<Model>('models')
	return modelsList.reduce(
		(models, model) => {
			if (model.variantOf === undefined)
				return {
					...models,
					[model.slug]: {
						...model,
						name: model.slug,
					},
				}
			const baseModel = modelsList.find(({ slug }) => slug === model.variantOf)
			if (baseModel === undefined)
				throw new Error(`Unknown base model ${model.variantOf}!`)
			return {
				...models,
				[model.slug]: {
					...baseModel,
					name: model.variantOf,
					variant: model.slug,
				},
			}
		},
		{} as Record<string, Model>,
	)
})()
