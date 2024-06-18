import { readdir, readFile } from 'node:fs/promises'
import path, { parse } from 'node:path'
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

export type MarkdownContent = Record<string, any> & {
	slug: string
	html: string
}
export type MarkdownContents = Array<MarkdownContent>

export const loadMarkdownContent = async (
	dir: string = 'models',
): Promise<MarkdownContents> => {
	const resourceFiles = (
		await readdir(path.join(process.cwd(), 'content', dir))
	).filter((f) => f.endsWith('.md'))

	return await Promise.all(
		resourceFiles.map(async (f) =>
			loadMarkdownContentFromFile(path.join(process.cwd(), 'content', dir, f)),
		),
	)
}

export const loadMarkdownContentFromFile = async (
	file: string,
): Promise<MarkdownContent> => {
	const source = await readFile(file, 'utf-8')
	const md = await parseMarkdown.process(source)

	return {
		...md.data,
		html: md.value,
		slug: parse(file).base.replace(/\.md$/, ''),
	} as MarkdownContent
}
