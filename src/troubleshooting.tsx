import { Header } from '@components/Header'
import { PreviewWarning } from '@components/PreviewWarning'
import { formatDistanceToNow } from 'date-fns'
import { render } from 'preact'

console.debug('version', VERSION)
console.debug(
	'build time',
	BUILD_TIME,
	formatDistanceToNow(new Date(BUILD_TIME), {
		addSuffix: true,
	}),
)

const root = document.getElementById('root')

if (root === null) {
	console.error(`Could not find root element!`)
} else {
	render(
		<>
			<PreviewWarning />
			<main>
				<article>
					<Header />
					<div class="container mt-4">
						<header>
							<h1>Troubleshooting guide</h1>
						</header>
						<div class="mt-4">
							<p>
								<em>Is it blinking?</em>
							</p>
							<p>No: -&gt; turn it on</p>
							<p>Yes: -&gt; which color?</p>
						</div>
					</div>
				</article>
			</main>
		</>,
		root,
	)
}
