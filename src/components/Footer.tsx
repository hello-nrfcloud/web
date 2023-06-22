import { NRFCloudLogo } from './icons/NRFCloudLogo.js'

const CopyrightYear = () => {
	const startYear = 2023
	const currentYear = new Date().getFullYear()

	return (
		<span>
			{currentYear > startYear
				? `${startYear}&ndash;${currentYear}`
				: startYear}
		</span>
	)
}

export const Footer = () => (
	<footer class="pt-4 pb-4 bg-light">
		<div class="container pt-4">
			<div class="row">
				<div class="col-12">
					<h2 class="text-body-secondary mt-3">About</h2>
					<p class="mb-2">
						<a
							href="https://nrfcloud.com/"
							class="text-body-tertiary text-decoration-none"
							target="_blank"
						>
							<NRFCloudLogo style={{ height: '16px' }} />
						</a>
					</p>
					<p class="mb-2">
						<a
							href="https://www.nordicsemi.com/Privacy"
							class="text-body-tertiary text-decoration-none"
							target="_blank"
						>
							Privacy Policy
						</a>
					</p>
					<p class="mb-2">
						<a
							href="https://www.nordicsemi.com/About-us/Contact-Us"
							class="text-body-tertiary text-decoration-none"
							target="_blank"
						>
							Contact us
						</a>
					</p>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-12 d-flex flex-col justify-content-between align-items-end">
					<div>
						<h2 class="text-body-secondary">Support</h2>
						<p>
							<a href="https://devzone.nordicsemi.com/" target="_blank">
								<img
									src="/static/images/devzone-dark.svg"
									alt="{DevZone"
									width="150"
								/>
							</a>
						</p>
					</div>
					<div>
						<a href="https://nordicsemi.com/" target="_blank">
							<img
								src={`/static/images/nordic-logo.svg?v=${VERSION}`}
								alt="Nordic Semiconductor"
								width="100"
							/>
						</a>
					</div>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-12 text-center text-body-secondary mt-4">
					<p>
						© <CopyrightYear /> Nordic Semiconductor. All rights reserved.
					</p>
					<p class="text-body-tertiary">
						<small>{VERSION}</small>
					</p>
				</div>
			</div>
		</div>
	</footer>
)
