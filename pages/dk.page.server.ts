import type { DK } from '@context/DKs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { loadMarkdownContent } from './loadMarkdownContent.js'

export type DKPageProps = { dk: DK }

export const prerender = async (): Promise<string[]> =>
	(await readdir(path.join(process.cwd(), 'content', 'dks')))
		.filter((s) => s.endsWith('.md'))
		.map((s) => s.replace(/\.md$/, ''))
		.map((slug) => `/dk/${slug}`)

export const onBeforeRender = async (args: {
	routeParams: { model: string }
}): Promise<{
	pageContext: { pageProps: DKPageProps }
}> => {
	const dks = await loadMarkdownContent<DK>('dks')
	const dk = dks.find(({ slug }) => slug === args.routeParams.model)
	if (dk === undefined)
		throw new Error(`Could not find DK: ${args.routeParams.model}!`)

	return {
		pageContext: {
			pageProps: {
				dk: {
					...dk,
					model: args.routeParams.model,
				},
			},
		},
	}
}
