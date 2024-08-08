import { Logo } from '#components/icons/Logo.js'
import './BrandHeader.css'

export const BrandHeader = () => (
	<header class="brand">
		<img
			src="/static/images/nordic-logo-square.svg"
			alt="Nordic Semiconductor"
			width="150"
			height="150"
			class="logo"
		/>
		<div class="hello-logo">
			<h1 class="fw-light">
				<Logo
					class="d-inline-block align-text-top me-2"
					style={{
						width: '60',
						height: '48',
					}}
				/>
				hello.nrfcloud.com
			</h1>
			<p>
				Retrieve real-time data from your long-range Nordic Semiconductor
				Development Kit within seconds.
			</p>
		</div>
	</header>
)
