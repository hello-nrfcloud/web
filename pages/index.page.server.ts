import type { DK } from '@context/Device'
import type { Resource } from '@context/Resources'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import format from 'rehype-format'
import html from 'rehype-stringify'
import { remark } from 'remark'
import extract from 'remark-extract-frontmatter'
import frontmatter from 'remark-frontmatter'
import remark2rehype from 'remark-rehype'
import yaml from 'yaml'

const parseMarkdown = remark()
	.use(frontmatter, ['yaml'])
	.use(extract, { yaml: yaml.parse })
	.use(remark2rehype)
	.use(format)
	.use(html)

export type IndexPageProps = { resources: Resource[]; dks: Record<string, DK> }

const loadMarkdownContent = async <
	T extends {
		html: string
	},
>(
	dir: 'resources' | 'dks',
): Promise<(T & { slug: string })[]> => {
	const resourceFiles = (
		await readdir(path.join(process.cwd(), 'content', dir))
	).filter((f) => f.endsWith('.md'))

	return await Promise.all(
		resourceFiles.map(async (f) => {
			const source = await readFile(
				path.join(process.cwd(), 'content', dir, f),
				'utf-8',
			)
			const md = await parseMarkdown.process(source)
			return {
				...md.data,
				html: md.value,
				slug: f.replace(/.md$/, ''),
			} as T & { slug: string }
		}),
	)
}

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
