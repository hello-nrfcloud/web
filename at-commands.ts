import chalk from 'chalk'
import glob from 'glob'
import { encode } from 'html-entities'
import { JSONPath } from 'jsonpath-plus'
import { readFile } from 'node:fs/promises'
import { parse } from 'node:path'
import path from 'node:path/posix'
import xmlJS from 'xml-js'

const debug = (...args: any[]) =>
	console.error(...args.map((s) => chalk.gray(s)))

const warn = (...args: any[]) =>
	console.error(
		chalk.bgGray.red.dim('[warn]'),
		...args.map((s) => chalk.red.dim(s)),
	)

type BaseNode = {
	type: 'element'
	name: string
	elements: Element[]
}
type TextNode = { type: 'text'; text: string }

type CmdNameNode = BaseNode & {
	name: 'cmdname'
}
type VersionNode = BaseNode & {
	name: 'version'
}
type GlossaryNode = {
	type: 'element'
	name: 'abbreviated-form'
	attributes: { keyref: string }
}
type CiteNode = BaseNode & {
	name: 'cite'
}
type PinNode = BaseNode & {
	name: 'pinname'
}
type SystemOutputNode = BaseNode & {
	name: 'systemoutput'
}
type CodeNode = BaseNode & {
	name: 'codeph'
}
type ElementNode = BaseNode & {
	name: 'element'
}
type CodeBlockNode = BaseNode & {
	name: 'codeblock'
}
type SupNode = BaseNode & {
	name: 'sup'
}
type SubNode = BaseNode & {
	name: 'sub'
}
type ParmNameNode = BaseNode & {
	name: 'parmname'
}
type ParameterListNode = BaseNode & {
	name: 'parml'
}
type UnorderedListNode = BaseNode & {
	name: 'ul'
}
type SimpleListNode = BaseNode & {
	name: 'sl'
}
type SimpleListItemNode = BaseNode & {
	name: 'sli'
}
type ListItemNode = BaseNode & {
	name: 'li'
}
type ParameterListEntryNode = BaseNode & {
	name: 'plentry'
}
type ParagraphNode = BaseNode & {
	name: 'p'
}
type ParameterTitleNode = BaseNode & {
	name: 'pt'
}
type ParameterDefinitionNode = BaseNode & {
	name: 'pd'
}
type PhraseNode = BaseNode & {
	name: 'ph'
	attributes?: { id?: string; conref: string }
}
type NoteNode = BaseNode & {
	name: 'note'
}
type FigureNode = BaseNode & {
	name: 'fig'
}
type TableNode = BaseNode & {
	name: 'table'
}
type ValueNode = BaseNode & {
	name: 'value'
}
type DefinitionListNode = BaseNode & {
	name: 'dl'
}
type FootnoteNode = BaseNode & {
	name: 'fn'
}
type CommentNode = { type: 'comment'; comment: string }
type XRefNode = BaseNode & {
	name: 'xref'
	attributes: { href: string }
}
type Element =
	| TextNode
	| GlossaryNode
	| CmdNameNode
	| VersionNode
	| CiteNode
	| PinNode
	| CodeNode
	| SupNode
	| SubNode
	| ParmNameNode
	| ParagraphNode
	| CodeBlockNode
	| ParameterListNode
	| ParameterListEntryNode
	| ParameterDefinitionNode
	| ParameterTitleNode
	| NoteNode
	| XRefNode
	| UnorderedListNode
	| ListItemNode
	| PhraseNode
	| SystemOutputNode
	| CommentNode
	| FigureNode
	| TableNode
	| DefinitionListNode
	| ValueNode
	| SimpleListItemNode
	| SimpleListNode
	| ElementNode
	| FootnoteNode

const isTextNode = (element: Element): element is TextNode =>
	typeof element === 'object' && 'type' in element && element.type === 'text'

const isCommentNode = (element: Element): element is CommentNode =>
	element.type === 'comment'

const isNodeWithName =
	<E extends Element>(name: string) =>
	(element: Element): element is E =>
		typeof element === 'object' &&
		'type' in element &&
		element.type === 'element' &&
		'name' in element &&
		element.name === name

const isSimpleListItemNode = isNodeWithName<SimpleListNode>('sli')
const isSimpleListNode = isNodeWithName<SimpleListNode>('sl')
const isFootnoteNode = isNodeWithName<FootnoteNode>('fn')
const isAbbreviatedForm = isNodeWithName<GlossaryNode>('abbreviated-form')
const isCommandName = isNodeWithName<CmdNameNode>('cmdname')
const isVersionNode = isNodeWithName<VersionNode>('version')
const isCiteNode = isNodeWithName<VersionNode>('cite')
const isPinNode = isNodeWithName<PinNode>('pinname')
const isSystemOutputNode = isNodeWithName<SystemOutputNode>('systemoutput')
const isCodeNode = isNodeWithName<CodeNode>('codeph')
const isCodeBlockNode = isNodeWithName<CodeBlockNode>('codeblock')
const isSupNode = isNodeWithName<SupNode>('sup')
const isSubNode = isNodeWithName<SubNode>('sub')
const isParamNameNode = isNodeWithName<ParmNameNode>('parmname')
const isNoteNode = isNodeWithName<NoteNode>('note')
const isPhraseNode = isNodeWithName<PhraseNode>('ph')
const isXRefNode = isNodeWithName<XRefNode>('xref')
const isParameterDefinitionNode = isNodeWithName<ParameterDefinitionNode>('pd')
const isParameterTitleNode = isNodeWithName<ParameterTitleNode>('pt')
const isParameterListNode = isNodeWithName<ParameterListNode>('parml')
const isFigureNode = isNodeWithName<FigureNode>('fig')
const isUnorderedListNode = isNodeWithName<UnorderedListNode>('ul')
const isListItemNode = isNodeWithName<ListItemNode>('li')
const isValueNode = isNodeWithName<ValueNode>('value')
const isParameterListEntryNode =
	isNodeWithName<ParameterListEntryNode>('plentry')
const isParagraphNode = isNodeWithName<ParagraphNode>('p')
const isTableNode = isNodeWithName<TableNode>('table')
const isDefinitionListNode = isNodeWithName<TableNode>('dl')

const hasElements = (
	element: unknown,
): element is {
	elements: Element[]
} => element !== null && typeof element === 'object' && 'elements' in element

const toMarkdown = (
	element: Element,
	glossary: Record<string, string>,
	phrases: Record<string, string>,
	onVersion?: (v: string) => unknown,
	raw = false,
): string | null => {
	const f = formatAsMarkdown(glossary, phrases, onVersion)
	const fRaw = formatAsMarkdown(glossary, phrases, onVersion, true)
	if (typeof element === 'string') return ''
	if (isTextNode(element)) {
		const t = element.text
			.replace(/\n/g, ' ')
			.replace(/ {2,}/, ' ')
			.replace(/\t+/, ' ')
		return raw ? t : encode(t)
	}
	if (isAbbreviatedForm(element))
		return glossary[element.attributes.keyref] ?? null
	if (
		isCommandName(element) ||
		isCodeNode(element) ||
		isPinNode(element) ||
		isSystemOutputNode(element) ||
		isParamNameNode(element) ||
		isValueNode(element)
	)
		return `\`${fRaw(element.elements)}\``
	if (isCiteNode(element)) {
		return `*${f(element.elements)}*`
	}
	if (isSupNode(element) || isParagraphNode(element) || isSubNode(element))
		return f(element.elements)
	if (isCodeBlockNode(element))
		return `\n\n\`\`\`\n${fRaw(element.elements)}\n\`\`\`\n\n`
	if (
		isParameterListNode(element) ||
		isUnorderedListNode(element) ||
		isSimpleListNode(element)
	)
		return `\n\n${f(element.elements)}\n\n`
	if (isListItemNode(element) || isSimpleListItemNode(element))
		return ` - ${f(element.elements)}\n`

	if (isParameterListEntryNode(element)) {
		return f(element.elements)
	}
	if (isParameterTitleNode(element)) return ` - ${f(element.elements)}\n`
	if (isParameterDefinitionNode(element)) return `   - ${f(element.elements)}\n`
	if (isNoteNode(element) || isFootnoteNode(element))
		return `\n\n> *Note:*\n${f(element.elements)
			.split('\n')
			.map((s) => `> ${s}`)
			.join('\n')}\n\n`
	if (isXRefNode(element)) {
		return `[${f(element.elements)}](${element.attributes.href})`
	}
	if (isPhraseNode(element)) {
		if (element.attributes?.conref !== undefined) {
			const phraseIdParts = element.attributes.conref.split('#')
			const phraseId = parse(phraseIdParts[0] ?? '')
			const lookupName = `${phraseId.base}#${phraseIdParts[1]}`
			const phrase = phrases[lookupName]
			if (phrase === undefined) {
				throw new Error(
					`Could not resolve phrase ${element.attributes.conref}!`,
				)
			}
			return phrase
		}
		return f(element.elements)
	}
	if (isCommentNode(element)) return `<!-- ${element.comment} -->`
	if (isFigureNode(element)) {
		debug(`Dropped figure: ${JSON.stringify(element)}.`)
		return ''
	}
	if (isTableNode(element)) {
		debug(`Dropped table: ${JSON.stringify(element)}.`)
		return ''
	}
	if (isDefinitionListNode(element)) {
		debug(`Dropped definition list: ${JSON.stringify(element)}.`)
		return ''
	}
	throw new Error(`Unsupported element ${JSON.stringify(element)}!`)
}
const formatAsMarkdown =
	(
		glossary: Record<string, string>,
		phrases: Record<string, string>,
		onVersion?: (v: string) => unknown,
		raw = false,
	) =>
	(elements: Element[]): string => {
		return (elements ?? [])
			.reduce((t, el) => {
				if (isVersionNode(el)) {
					onVersion?.(
						formatAsMarkdown(glossary, phrases, onVersion, raw)(el.elements),
					)
					return t
				}
				const elText = toMarkdown(el, glossary, phrases, onVersion, raw)
				if (elText === null)
					throw new Error(`Could not convert ${JSON.stringify(el)} to text!`)
				return [...t, elText]
			}, [] as string[])
			.join('')
	}

// Collect glossary

const glossaryDir = path.join(
	process.cwd(),
	'infocenter',
	'dita_common',
	'glossary',
)

const glossary: Record<string, string> = {}

for (const f of await glob('*.dita', {
	cwd: glossaryDir,
})) {
	const parsed = xmlJS.xml2js(
		await readFile(path.join(glossaryDir, f), 'utf-8'),
	)
	const id = parsed.elements[1].attributes.id
	const glossterm = JSONPath({
		path: `$..elements[?(@parent.name === 'glossentry')].[?(@parent.name === 'glossterm')]`,
		json: parsed,
	})
	glossary[id] = formatAsMarkdown(glossary, {})(glossterm)
}

glossary['pdpcont'] = glossary['pdn'] as string
glossary['16qam'] = glossary['sixteen_qam'] as string

const commandsDir = path.join(process.cwd(), 'infocenter', 'REF', 'at_commands')

// Collect re-usable paragraphs

const collectPhrases = (
	elements: Element[],
	glossary: Record<string, string>,
	onPhrase: (id: string, text: string) => unknown,
) => {
	for (const el of elements) {
		if (isPhraseNode(el) && el?.attributes?.id !== undefined) {
			onPhrase(el.attributes.id, formatAsMarkdown(glossary, {})(el.elements))
		}
		if (hasElements(el)) {
			collectPhrases(el.elements, glossary, onPhrase)
		}
	}
}

const phrases: Record<string, string> = {}
for (const f of await glob('**/*.dita', { cwd: commandsDir })) {
	const parsed = xmlJS.xml2js(
		await readFile(path.join(commandsDir, f), 'utf-8'),
	)
	const rootId = parsed.elements[1].attributes.id
	collectPhrases(parsed.elements, glossary, (id, text) => {
		phrases[`${parse(f).name}${parse(f).ext}#${rootId}/${id}`] = text
	})
}

// Collect AT commands

const ignored = [
	'intro',
	'at_version',
	'at_history',
	'at_syntax',
	'at_syntax_test',
	'at_syntax_set',
	'at_syntax_response',
	'at_syntax_read',
]
type ATSubCommand = {
	title: string
	shortDesc: string
	ref: string
}
type ATCommand = {
	title: string
	shortDesc: string
	versions: string[]
	subCommands: {
		read?: ATSubCommand
		set?: ATSubCommand
		test?: ATSubCommand
	}
}
const atCommands: Record<string, ATCommand> = {}
for (const f of await glob('**/*.dita', { cwd: commandsDir })) {
	const parsed = xmlJS.xml2js(
		await readFile(path.join(commandsDir, f), 'utf-8'),
	)
	if (parsed.elements[1].name !== 'concept') continue
	const id = parsed.elements[1].attributes.id
	if (ignored.includes(id)) continue
	const title = JSONPath({
		path: `$..elements[?(@parent.name === 'concept')].[?(@parent.name === 'title')]`,
		json: parsed,
	})
	const shortDesc = JSONPath({
		path: `$..elements[?(@parent.name === 'concept')].[?(@parent.name === 'shortdesc')]`,
		json: parsed,
	})
	const versions: string[] = []
	const format = formatAsMarkdown(glossary, phrases, (v) => versions.push(v))
	atCommands[id] = {
		title: format(title),
		shortDesc: format(shortDesc),
		versions,
		subCommands: {},
	}
}

const atCommandAliasMap: Record<string, string> = {
	cnma_text: 'cnma',
}

for (const f of await glob('**/*.dita', { cwd: commandsDir })) {
	const parsed = xmlJS.xml2js(
		await readFile(path.join(commandsDir, f), 'utf-8'),
	)
	if (parsed.elements[1].name !== 'reference') continue
	const id = parsed.elements[1].attributes.id
	if (ignored.includes(id)) continue

	const { atCmd, type } =
		/^(?<atCmd>[a-z_]+)_(?<type>read|set|test)$/.exec(id)?.groups ?? {}

	if (atCmd === undefined) {
		warn(`Not an AT sub-command: ${id} from ${f}`)
		continue
	}

	if (atCommands[atCmd] === undefined) {
		warn(`Unknown AT command: ${atCmd}`)
		continue
	}

	const aliasedAtCmd = atCommandAliasMap[atCmd] ?? atCmd

	const versions: string[] = []
	const format = formatAsMarkdown(glossary, phrases, (v) => versions.push(v))

	const title = format(
		JSONPath({
			path: `$..elements[?(@parent.name === 'reference')].[?(@parent.name === 'title')]`,
			json: parsed,
		}),
	)

	const shortDesc = format(
		JSONPath({
			path: `$..elements[?(@parent.name === 'reference')].[?(@parent.name === 'shortdesc')]`,
			json: parsed,
		}),
	)

	const ref = format(
		JSONPath({
			path: `$..elements[?(@parent.name === 'reference')].[?(@parent.name === 'refbody')].[?(@parent.name === 'section')]`,
			json: parsed,
		}),
	)

	;(atCommands[aliasedAtCmd] as ATCommand).subCommands[
		type as 'read' | 'set' | 'test'
	] = {
		title,
		shortDesc,
		ref,
	}
}

console.log(JSON.stringify(atCommands, null, 2))
