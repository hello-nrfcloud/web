import { isUnsupported, type Model } from '#content/models/types.js'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'

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
				if ('variant' in ((await loadModelsFromMarkdown)[slug] ?? {}))
					return undefined
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
	const model = (await loadModelsFromMarkdown)[args.routeParams.model]
	if (model === undefined)
		throw new Error(`Could not find model: ${args.routeParams.model}!`)
	if (isUnsupported(model))
		throw new Error(`Model ${model.slug} is unsupported!`)

	return {
		pageContext: {
			pageProps: {
				model: {
					...model,
					slug: args.routeParams.model,
				},
			},
		},
	}
}
