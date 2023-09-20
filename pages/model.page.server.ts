import type { Model } from '#context/Models.js'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { loadMarkdownContent } from './loadMarkdownContent.js'

export type ModelPageProps = { model: Model }

export const prerender = async (): Promise<string[]> =>
	(await readdir(path.join(process.cwd(), 'content', 'models')))
		.filter((s) => s.endsWith('.md'))
		.filter((s) => s !== 'unsupported.md')
		.map((s) => s.replace(/\.md$/, ''))
		.map((slug) => `/model/${slug}`)

export const onBeforeRender = async (args: {
	routeParams: { model: string }
}): Promise<{
	pageContext: { pageProps: ModelPageProps }
}> => {
	const models = await loadMarkdownContent<Model>('models')
	const model = models.find(({ slug }) => slug === args.routeParams.model)
	if (model === undefined)
		throw new Error(`Could not find model: ${args.routeParams.model}!`)

	return {
		pageContext: {
			pageProps: {
				model: {
					...model,
					name: args.routeParams.model,
				},
			},
		},
	}
}
