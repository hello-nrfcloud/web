import './AboutHeader.css'
import { Logo } from './icons/Logo.js'

export const AboutHeader = () => (
	<div class="openSourceBg">
		<div
			style={{
				backgroundColor: 'var(--color-nordic-blue)',
			}}
			class="pt-4 pb-4"
		>
			<header class="container pt-4 pb-4 text-white">
				<div class="row d-flex align-items-center flex-row">
					<div class="col-12 col-sm-6 col-md-4">
						<h1>
							<Logo strokeWidth={2} color={'white'} /> hello.nrfcloud.com
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
			<div class="bg" />
		</div>
	</div>
)
