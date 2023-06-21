import { styled } from 'styled-components'

const W = styled.div`
	background-color: var(--color-nordic-sun);
	color: var(--color-nordic-dark-grey);
`

export const PreviewWarning = () => (
	<W role="alert">
		<div class="container p-2 d-flex justify-content-between">
			<strong>
				Early access: this project is under development and you may experience
				service interruptions.
			</strong>
		</div>
	</W>
)
