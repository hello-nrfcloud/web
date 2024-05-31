import type { Model } from '#context/Models.js'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { loadMarkdownContent } from './loadMarkdownContent.js'
import { models } from '../content/models.js'

export type ModelPageProps = { model: Model }

export const prerender = async (): Promise<string[]> => {
	const slugs = (await readdir(path.join(process.cwd(), 'content', 'models')))
		.filter((s) => s.endsWith('.md'))
		.filter((s) => s !== 'unsupported.md')
		.map((s) => s.replace(/\.md$/, ''))

	return (
		await Promise.all(
			slugs.map(async (slug) => {
				// Do not build pages for variants
				if ((await models)[slug]?.variant !== undefined) return undefined
				return slug
			}),
		)
	)
		.filter((slug) => slug !== undefined)
		.map((slug) => `/model/${slug}`)
}

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
