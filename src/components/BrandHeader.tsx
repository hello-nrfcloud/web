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
			<h1>
				<img
					src={`/static/images/logo.svg?v=${VERSION}`}
					alt="Logo"
					width="60"
					height="48"
					class="d-inline-block align-text-top me-1"
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
