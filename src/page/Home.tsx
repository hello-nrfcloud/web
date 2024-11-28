import { ModelSelector } from '#components/ModelSelector.js'
import { ScanQR } from '#components/ScanQR.js'
import { useModels } from '#context/Models.js'

export const Home = () => {
	const { models } = useModels()
	return (
		<main>
			<article>
				<ScanQR />
				{Object.keys(models).length > 1 && (
					<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
						<div class="container">
							<div class="row">
								<div class="col-12">
									<h2 class="mt-4">... or select your hardware</h2>
								</div>
							</div>
							<ModelSelector />
						</div>
					</div>
				)}
			</article>
		</main>
	)
}
