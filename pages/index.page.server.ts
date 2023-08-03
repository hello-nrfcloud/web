import type { Model } from '#context/Models.js'
import { loadMarkdownContent } from './loadMarkdownContent.js'

export type IndexPageProps = { models: Record<string, Model> }

export const onBeforeRender = async (): Promise<{
	pageContext: { pageProps: IndexPageProps }
}> => {
	const models = await loadMarkdownContent<Model>('models')

	return {
		pageContext: {
			pageProps: {
				models: models.reduce(
					(models, model) => ({
						...models,
						[model.slug]: {
							...model,
							name: model.slug,
						},
					}),
					{} as Record<string, Model>,
				),
			},
		},
	}
}
