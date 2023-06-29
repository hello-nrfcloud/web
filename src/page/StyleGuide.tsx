import { SourceHeader } from '#components/SourceHeader.js'
import { StyleGuide } from '#components/StyleGuide.js'

export const StyleGuidePage = () => (
	<main>
		<article>
			<SourceHeader />
			<div class="container mt-4">
				<div class="row mt-4">
					<div class="col-12">
						<StyleGuide />
					</div>
				</div>
			</div>
		</article>
	</main>
)
