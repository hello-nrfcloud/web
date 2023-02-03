import { Header } from '@components/Header'
import { PreviewWarning } from '@components/PreviewWarning'

export const Troubleshooting = () => (
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
	</>
)
