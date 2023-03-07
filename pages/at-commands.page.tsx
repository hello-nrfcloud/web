import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { PreviewWarning } from '@components/PreviewWarning'
import { X } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
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

type ATSubCommand = {
	title: string // e.g. 'Test command'
	shortDesc: string // (markdown) e.g. 'The test command lists supported functional modes.'
	ref: string // (markdown) e.g. 'Response syntax:\n\n```\n+CFUN: (list of supported <fun>s)\n```\n\nThe response parameters and their defined values are the following:\n\n - : \n\n\nThe following command example returns the supported functional modes:\n\n```\nAT+CFUN=? +CFUN: (0,1,4,20,21,30,31,40,41,44) OK\n```\n\n'
}

type ATCommand = {
	title: string // e.g. 'Functional mode +CFUN'
	shortDesc: string // e.g. 'The `+CFUN` command sets and reads the modem functional mode.'
	versions?: string[] // e.g. ['v1.0.x', 'v1.1.x', 'v1.2.x', 'v1.3.x']
}

enum CommandType {
	set = 'set',
	read = 'read',
	test = 'test',
}
const commandtypes = [CommandType.read, CommandType.set, CommandType.test]
type ATCommands = Record<
	string,
	ATCommand & {
		subCommands: Record<CommandType, ATSubCommand>
	}
>

type SearchResult = (ATSubCommand & {
	type: CommandType
	command: { id: string } & ATCommand
})[]

const find = (
	commands: ATCommands,
	searchTerm: string,
	typeFilter: CommandType[],
): SearchResult => {
	const matcher = new RegExp(searchTerm, 'i')
	return Object.entries(commands)
		.map(([atCommand, command]) =>
			Object.entries(command.subCommands).map(([type, subCommand]) => ({
				command: { ...command, id: atCommand },
				type: type as CommandType,
				...subCommand,
			})),
		)
		.flat()
		.filter((sub) => typeFilter.length === 0 || typeFilter.includes(sub.type))
		.filter(
			({ title, command: { id } }) => matcher.test(id) || matcher.test(title),
		)
}

// FIXME: do not render Markdown in real-time
export const Page = () => {
	const [commands, setCommands] = useState<ATCommands>({})
	const [typeFilter, setTypeFilter] = useState<CommandType[]>([CommandType.set])
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [result, setResult] = useState<SearchResult>([])

	useEffect(() => {
		fetch('/static/at-commands.json')
			.then(async (res) => res.json())
			.then((commands) => {
				setCommands(commands)
			})
			.catch(console.error)
	}, [])

	useEffect(() => {
		const t = setTimeout(() => {
			setResult(
				searchTerm.length >= 3 ? find(commands, searchTerm, typeFilter) : [],
			)
		}, 250)
		return () => {
			clearTimeout(t)
		}
	}, [searchTerm, typeFilter])

	return (
		<>
			<PreviewWarning />
			<main>
				<article>
					<Header />
					<div class="container mt-4 mb-4">
						<div class="row">
							<header class="col">
								<h1>nRF9160 AT Commands</h1>
							</header>
						</div>
						<div class="row mt-4">
							<form
								onSubmit={(e) => {
									e.preventDefault()
									return false
								}}
							>
								<div class="mb-3">
									<label htmlFor="searchInput" class="form-label">
										Search within all nRF9160 AT commands:
									</label>
									<div class="input-group">
										<input
											type="text"
											class="form-control"
											id="searchInput"
											placeholder="e.g. 'CFUN'"
											value={searchTerm}
											onChange={(e) => {
												setSearchTerm((e.target as HTMLInputElement).value)
											}}
										/>
										{searchTerm.length > 0 && (
											<button
												class="btn btn-outline-danger"
												type="button"
												onClick={() => {
													setSearchTerm('')
												}}
											>
												<X />
											</button>
										)}
									</div>
								</div>
								<div class="mb-3">
									<div class="form-text">
										Limit results to AT commands of these types:
									</div>
									{commandtypes.map((type) => (
										<div class="form-check form-check-inline">
											<input
												class="form-check-input"
												type="checkbox"
												id={`type-${type}`}
												value={type}
												checked={typeFilter.includes(type)}
												onClick={() => {
													setTypeFilter((f) =>
														f.includes(type)
															? f.filter((t) => t !== type)
															: [type, ...f],
													)
												}}
											/>
											<label class="form-check-label" for={`type-${type}`}>
												{type}
											</label>
										</div>
									))}
								</div>
							</form>
						</div>
						{result.length > 0 && (
							<>
								<div class="row mt-4">
									<ul>
										{result.map(({ type, command }) => (
											<li>
												{command.title} <em>{type}</em>
											</li>
										))}
									</ul>
								</div>
								<div class="row mt-4">
									{result.map(({ command, title, shortDesc, ref }) => (
										<>
											<h2>{command.title}</h2>
											<div
												dangerouslySetInnerHTML={{
													__html: parseMarkdown
														.processSync(command.shortDesc)
														.value.toString('utf-8'),
												}}
											/>
											<h3>{title}</h3>
											<div
												dangerouslySetInnerHTML={{
													__html: parseMarkdown
														.processSync(shortDesc)
														.value.toString('utf-8'),
												}}
											/>
											<div
												dangerouslySetInnerHTML={{
													__html: parseMarkdown
														.processSync(ref)
														.value.toString('utf-8'),
												}}
											/>
										</>
									))}
								</div>
							</>
						)}
					</div>
					<Footer />
				</article>
			</main>
		</>
	)
}
