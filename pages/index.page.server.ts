import type { DK } from '@context/Device'
import type { Resource } from '@context/Resources'
import { loadMarkdownContent } from './loadMarkdownContent'

export type IndexPageProps = { resources: Resource[]; dks: Record<string, DK> }

export const onBeforeRender = async (): Promise<{
	pageContext: { pageProps: IndexPageProps }
}> => {
	const resources = await loadMarkdownContent<Resource>('resources')
	const dks = await loadMarkdownContent<DK>('dks')

	return {
		pageContext: {
			pageProps: {
				resources,
				dks: dks.reduce(
					(dks, dk) => ({
						...dks,
						[dk.slug]: {
							...dk,
							model: dk.slug,
							tags: [...dk.tags, `model:${dk.slug}`],
						},
					}),
					{} as Record<string, DK>,
				),
			},
		},
	}
}
