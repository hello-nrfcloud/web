import glob from 'glob'
import { JSONPath } from 'jsonpath-plus'
import { readFile } from 'node:fs/promises'
import { parse } from 'node:path'
import path from 'node:path/posix'
import xmlJS from 'xml-js'

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
type ListItemNode = BaseNode & {
	name: 'li'
}
type ParameterListEntryNode = BaseNode & {
	name: 'plentry'
}
type ParagraphNode = BaseNode & {
	name: 'p'
}
type ParemeterTitleNode = BaseNode & {
	name: 'pt'
}
type ParemeterDefinitionNode = BaseNode & {
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
	| ParemeterDefinitionNode
	| ParemeterTitleNode
	| NoteNode
	| XRefNode
	| UnorderedListNode
	| ListItemNode
	| PhraseNode
	| SystemOutputNode
	| CommentNode
	| FigureNode

const isTextNode = (element: Element): element is TextNode =>
	typeof element === 'object' && 'type' in element && element.type === 'text'

const nodeName = (element: Element): string | null =>
	typeof element === 'object' &&
	'type' in element &&
	element.type === 'element' &&
	'name' in element
		? element.name
		: null

const isAbbreviatedForm = (element: Element): element is GlossaryNode =>
	nodeName(element) === 'abbreviated-form'

const isCommandName = (element: Element): element is CmdNameNode =>
	nodeName(element) === 'cmdname'

const isVersionNode = (element: Element): element is VersionNode =>
	nodeName(element) === 'version'

const isCiteNode = (element: Element): element is VersionNode =>
	nodeName(element) === 'cite'

const isPinNode = (element: Element): element is PinNode =>
	nodeName(element) === 'pinname'

const isSystemOutputNode = (element: Element): element is SystemOutputNode =>
	nodeName(element) === 'systemoutput'

const isCodeNode = (element: Element): element is CodeNode =>
	nodeName(element) === 'codeph'

const isCodeBlockNode = (element: Element): element is CodeBlockNode =>
	nodeName(element) === 'codeblock'

const isSupNode = (element: Element): element is SupNode =>
	nodeName(element) === 'sup'

const isSubNode = (element: Element): element is SubNode =>
	nodeName(element) === 'sub'

const isParamNameNode = (element: Element): element is ParmNameNode =>
	nodeName(element) === 'parmname'

const isNoteNode = (element: Element): element is NoteNode =>
	nodeName(element) === 'note'

const isCommentNode = (element: Element): element is CommentNode =>
	element.type === 'comment'

const isPhraseNode = (element: Element): element is PhraseNode =>
	nodeName(element) === 'ph'

const isXRefNode = (element: Element): element is XRefNode =>
	nodeName(element) === 'xref'

const isParemeterTitleNode = (
	element: Element,
): element is ParemeterTitleNode => nodeName(element) === 'pt'

const isParemeterDefinitionNode = (
	element: Element,
): element is ParemeterDefinitionNode => nodeName(element) === 'pd'

const isParameterListNode = (element: Element): element is ParameterListNode =>
	nodeName(element) === 'parml'
const isFigureNode = (element: Element): element is FigureNode =>
	nodeName(element) === 'fig'

const isUnorderedListNode = (element: Element): element is UnorderedListNode =>
	nodeName(element) === 'ul'

const isListItemNode = (element: Element): element is ListItemNode =>
	nodeName(element) === 'li'

const isParameterListEntryNode = (
	element: Element,
): element is ParameterListEntryNode => nodeName(element) === 'plentry'

const isParagraphNode = (element: Element): element is ParagraphNode =>
	nodeName(element) === 'p'

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
): string | null => {
	if (typeof element === 'string') return ''
	if (isTextNode(element))
		return element.text
			.replace(/\n/g, ' ')
			.replace(/ {2,}/, ' ')
			.replace(/\t+/, ' ')
	if (isAbbreviatedForm(element))
		return glossary[element.attributes.keyref] ?? null
	if (
		isCommandName(element) ||
		isCodeNode(element) ||
		isPinNode(element) ||
		isSystemOutputNode(element) ||
		isParamNameNode(element)
	)
		return `\`${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}\``
	if (isCiteNode(element)) {
		return `*${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}*`
	}
	if (isSupNode(element) || isParagraphNode(element) || isSubNode(element))
		return formatAsMarkdown(element.elements, glossary, phrases, onVersion)
	if (isCodeBlockNode(element))
		return `\n\n\`\`\`\n${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}\n\`\`\`\n\n`
	if (isParameterListNode(element))
		return `\n\n${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}\n\n`
	if (isParameterListEntryNode(element) || isListItemNode(element))
		return ` - ${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}\n`
	if (isParemeterDefinitionNode(element))
		return `${formatAsMarkdown(element.elements, glossary, phrases, onVersion)}`
	if (isParemeterTitleNode(element))
		return `: ${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}`
	if (isNoteNode(element))
		return `> *Note:*\n${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)
			.split('\n')
			.map((s) => `> ${s}`)
			.join('\n')}\n\n`
	if (isXRefNode(element)) {
		return `[${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}](${element.attributes.href})`
	}
	if (isUnorderedListNode(element)) {
		return `\n\n${formatAsMarkdown(
			element.elements,
			glossary,
			phrases,
			onVersion,
		)}\n\n`
	}
	if (isPhraseNode(element) && element.attributes?.conref !== undefined) {
		const phraseIdParts = element.attributes.conref.split('#')
		const phraseId = parse(phraseIdParts[0] ?? '')
		const lookupName = `${phraseId.base}#${phraseIdParts[1]}`
		const phrase = phrases[lookupName]
		if (phrase === undefined) {
			throw new Error(`Could not resolve phrase ${element.attributes.conref}!`)
		}
		return phrase
	}
	if (isCommentNode(element)) return `<!-- ${element.comment} -->`
	if (isFigureNode(element)) {
		console.debug(`Dropped figure: ${JSON.stringify(element)}.`)
		return ''
	}
	throw new Error(`Unsupported element ${JSON.stringify(element)}!`)
}
const formatAsMarkdown = (
	elements: Element[],
	glossary: Record<string, string>,
	phrases: Record<string, string>,
	onVersion?: (v: string) => unknown,
): string =>
	(elements ?? [])
		.reduce((t, el) => {
			if (isVersionNode(el)) {
				onVersion?.(formatAsMarkdown(el.elements, glossary, phrases, onVersion))
				return t
			}
			const elText = toMarkdown(el, glossary, phrases)
			if (elText === null)
				throw new Error(`Could not convert ${JSON.stringify(el)} to text!`)
			return [...t, elText]
		}, [] as string[])
		.join('')

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
	glossary[id] = formatAsMarkdown(glossterm, glossary, {})
}

glossary['pdpcont'] = glossary['pdn'] as string

const commandsDir = path.join(process.cwd(), 'infocenter', 'REF', 'at_commands')

// Collect re-usable paragraphs

const collectPhrases = (
	elements: Element[],
	glossary: Record<string, string>,
	onPhrase: (id: string, text: string) => unknown,
) => {
	for (const el of elements) {
		if (isPhraseNode(el) && el?.attributes?.id !== undefined) {
			onPhrase(el.attributes.id, formatAsMarkdown(el.elements, glossary, {}))
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
	atCommands[id] = {
		title: formatAsMarkdown(title, glossary, phrases, (v) => versions.push(v)),
		shortDesc: formatAsMarkdown(shortDesc, glossary, phrases, (v) =>
			versions.push(v),
		),
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
		console.debug(`[warn] Not an AT sub-command: ${id} from ${f}`)
		continue
	}

	if (atCommands[atCmd] === undefined) {
		console.debug(`[warn] Unknown AT command: ${atCmd}`)
		continue
	}

	const aliasedAtCmd = atCommandAliasMap[atCmd] ?? atCmd

	const versions: string[] = []

	const title = formatAsMarkdown(
		JSONPath({
			path: `$..elements[?(@parent.name === 'reference')].[?(@parent.name === 'title')]`,
			json: parsed,
		}),
		glossary,
		phrases,
		(v) => versions.push(v),
	)

	const shortDesc = formatAsMarkdown(
		JSONPath({
			path: `$..elements[?(@parent.name === 'reference')].[?(@parent.name === 'shortdesc')]`,
			json: parsed,
		}),
		glossary,
		phrases,
		(v) => versions.push(v),
	)

	const ref = formatAsMarkdown(
		JSONPath({
			path: `$..elements[?(@parent.name === 'reference')].[?(@parent.name === 'refbody')].[?(@parent.name === 'section')]`,
			json: parsed,
		}),
		glossary,
		phrases,
		(v) => versions.push(v),
	)

	;(atCommands[aliasedAtCmd] as ATCommand).subCommands[
		type as 'read' | 'set' | 'test'
	] = {
		title,
		shortDesc,
		ref,
	}

	console.log(atCommands[aliasedAtCmd])
}
