import { DKSelector } from '@components/DKSelector'
import { SelectedDK } from '@components/SelectedDK'
import { CellularTag, WiFiTag } from '@components/Tags'
import { Warning } from '@components/Warning'

type Components = {
	name: string
	examples: {
		component: JSX.Element
		description: string
	}[]
}[]

const noop = () => undefined

export const Storybook = () => {
	const components: Components = [
		{
			name: 'Warning',
			examples: [
				{
					component: <Warning title="This is a warning!" />,
					description: 'A warning shown on top of the page.',
				},
			],
		},
		{
			name: 'DKSelector',
			examples: [
				{
					component: <DKSelector onSelect={noop} />,
					description: 'Allows to select a DK',
				},
			],
		},
		{
			name: 'SelectedDK',
			examples: [
				{
					component: <SelectedDK selected="PCA10090" clearSelection={noop} />,
					description: 'Shows a selected DK',
				},
			],
		},
		{
			name: 'Tags',
			examples: [
				{
					component: <CellularTag />,
					description: 'Tag for cellular content',
				},
				{
					component: <WiFiTag />,
					description: 'Tag for Wi-Fi content',
				},
			],
		},
	]
	return (
		<div class="d-flex flex-row">
			<Sidebar components={components} />
			<main class="flex-grow-1 ms-4 me-4">
				{components.map(({ name, examples }) => (
					<>
						<section id={name} class="mt-4 mb-4">
							<h2>{name}</h2>
							{examples.map(({ component, description }) => (
								<>
									<aside class={'mt-4'}>
										<p>{description}</p>
									</aside>
									<div>{component}</div>
								</>
							))}
						</section>
					</>
				))}
			</main>
		</div>
	)
}

const Sidebar = ({ components }: { components: Components }) => (
	<aside
		class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
		style="width: 280px;"
	>
		<a
			href="/storybook.html"
			class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
		>
			<span class="fs-4">Storybook</span>
		</a>
		<hr />
		<ul class="nav nav-pills flex-column mb-auto">
			{components.map(({ name }) => (
				<li class="nav-item">
					<a href={`#${name}`} class="nav-link" aria-current="page">
						{name}
					</a>
				</li>
			))}
		</ul>
	</aside>
)
