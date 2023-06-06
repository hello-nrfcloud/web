import { CloudLightning } from 'lucide-preact'

export const SourceHeader = () => (
	<div
		style={{
			backgroundColor: 'var(--color-nordic-dark-grey)',
			fontFamily: 'var(--monospace-font)',
		}}
		class="pt-4 pb-4"
	>
		<header class="container pt-4 pb-4 text-white">
			<div class="row">
				<div class="col-6">
					<h1>
						<CloudLightning strokeWidth={1} size={35} /> Muninn: the source
					</h1>
					<p>
						Learn how we've built <em>Muninn</em>.
					</p>
				</div>
			</div>
		</header>
	</div>
)
