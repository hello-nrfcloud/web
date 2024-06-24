import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'

export const onBeforePrerenderStart = async (): Promise<string[]> => {
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
