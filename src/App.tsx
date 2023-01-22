import { Warning } from '@components/Warning'
import { SelectDK } from '@flow/SelectDK'

export const App = () => (
	<>
		<main class={'container'}>
			<Warning title="Development preview: this project is under development and not ready to use." />
			<article>
				<h1>nRF Guide</h1>
				<p>
					Welcome to <em>nRF Guide</em> your getting started guide for the
					Nordic Semiconductor Development Kits.
				</p>
			</article>
			<SelectDK />
		</main>
	</>
)
