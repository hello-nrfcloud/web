import type { Model } from '#context/Models.js'
import { models } from '#content/models.js'

export type IndexPageProps = { models: Record<string, Model> }

export const onBeforeRender = async (): Promise<{
	pageContext: { pageProps: IndexPageProps }
}> => ({
	pageContext: {
		pageProps: {
			models: await models,
		},
	},
})
