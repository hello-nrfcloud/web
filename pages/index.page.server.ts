import type { DK } from '#context/DKs.js'
import { loadMarkdownContent } from './loadMarkdownContent.js'

export type IndexPageProps = { dks: Record<string, DK> }

export const onBeforeRender = async (): Promise<{
	pageContext: { pageProps: IndexPageProps }
}> => {
	const dks = await loadMarkdownContent<DK>('dks')

	return {
		pageContext: {
			pageProps: {
				dks: dks.reduce(
					(dks, dk) => ({
						...dks,
						[dk.slug]: {
							...dk,
							model: dk.slug,
						},
					}),
					{} as Record<string, DK>,
				),
			},
		},
	}
}
