import { isUnsupported, type Model } from '#content/models/types.js'
import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'

export type IndexPageProps = { models: Record<string, Model> }

export const onBeforeRender = async (): Promise<{
	pageContext: { pageProps: IndexPageProps }
}> => ({
	pageContext: {
		pageProps: {
			models: Object.values(await loadModelsFromMarkdown)
				.filter((model) => !isUnsupported(model))
				.reduce(
					(acc, model) => ({
						...acc,
						[model.slug]: model,
					}),
					{},
				),
		},
	},
})
