import { styled } from 'styled-components'

const W = styled.div`
	background-color: #e10707;
	color: white;
	text-shadow: 1px 1px 2px #00000033, -1px 1px 2px #00000033,
		-1px -1px 2px #00000033, 1px -1px 2px #00000033;
`

export const PreviewWarning = () => (
	<W role="alert">
		<div class="container p-2 d-flex justify-content-between">
			<strong>
				Development preview: this project is under development and not ready to
				use.
			</strong>
			<span>NORDIC INTERNAL</span>
		</div>
	</W>
)
