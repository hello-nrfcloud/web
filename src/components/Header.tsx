import styled from 'styled-components'

const OpenSourceBG = styled.div`
	background-color: var(--color-nordic-blue);
	position: relative;
	header {
		position: relative;
		z-index: 100;
	}
	aside {
		font-family: var(--monospace-font);
	}
`
const Bg = styled.div`
	z-index: 99;
	position: absolute;
	top: 0;
	right: 0;
	background: var(--color-nordic-dark-grey);
	width: 100%;
	height: 100%;
	&:before {
		position: absolute;
		content: ' ';
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		background: var(--color-nordic-dark-grey);
		background: linear-gradient(
			225deg,
			var(--color-nordic-dark-grey) 45%,
			var(--color-nordic-blue) 45%
		);
	}
`

export const Header = () => (
	<OpenSourceBG>
		<div
			style={{
				backgroundColor: 'var(--color-nordic-blue)',
			}}
			class="pt-4 pb-4"
		>
			<header class="container pt-4 pb-4 text-white">
				<div class="row">
					<div class="col-6">
						<h1>nRF Guide</h1>
						<p>
							Welcome to <em>nRF Guide</em> your getting started guide for the
							Nordic Semiconductor Development Kits.
						</p>
					</div>
					<div class="col-2"></div>
					<aside class="col-4">
						<h2 class="h4">This project is open-source</h2>
						<p>
							<a href="/view-source" class="text-white">
								Learn how we've built it.
							</a>
						</p>
					</aside>
				</div>
			</header>
			<Bg />
		</div>
	</OpenSourceBG>
)
