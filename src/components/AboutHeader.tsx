import { CloudSun } from 'lucide-preact'
import { styled } from 'styled-components'

const OpenSourceBG = styled.div`
	background-color: var(--color-nordic-blue);
	position: relative;
	header {
		position: relative;
		z-index: 2;
	}
`
const Bg = styled.div`
	z-index: 1;
	position: absolute;
	top: 0;
	right: 0;
	@media (min-width: 576px) {
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
	}
`

export const AboutHeader = () => (
	<OpenSourceBG>
		<div
			style={{
				backgroundColor: 'var(--color-nordic-blue)',
			}}
			class="pt-4 pb-4"
		>
			<header class="container pt-4 pb-4 text-white">
				<div class="row d-flex align-items-center flex-direction-row">
					<div class="col-12 col-sm-6 col-md-4">
						<h1>
							<CloudSun strokeWidth={1} size={35} /> hello.nrfcloud.com
						</h1>
						<p>
							Retrieve real-time data from your long-range Nordic Semiconductor
							Development Kits within seconds.
						</p>
					</div>
					<aside class="col-12 col-sm-6 offset-md-4 col-md-4">
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
