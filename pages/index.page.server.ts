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

export type IndexPageProps = { resources: Resource[] }

export const onBeforeRender = async (): Promise<{
	pageContext: { pageProps: IndexPageProps }
}> => {
	const content = (await readdir(path.join(process.cwd(), 'content'))).filter(
		(f) => f.endsWith('.md'),
	)

	const resources: Resource[] = await Promise.all(
		content.map(async (f) => {
			const source = await readFile(
				path.join(process.cwd(), 'content', f),
				'utf-8',
			)
			const md = await parseMarkdown.process(source)
			return {
				...md.data,
				descriptionHTML: md.value,
			} as Resource
		}),
	)

	return {
		pageContext: {
			pageProps: {
				resources: resources,
			},
		},
	}
}
