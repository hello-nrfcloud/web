import type { DK } from '@context/Device'

export const DKResources = ({ type }: { type: DK }) => (
	<section
		style={{
			backgroundColor: 'var(--color-nordic-sky)',
		}}
		class="pt-4 pb-4"
	>
		<div class="container">
			<div class="row  justify-content-end">
				<div class="col-8">
					<h3>Resources for your development kit:</h3>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-4">
					<img
						alt={`${type.title} (${type.model})`}
						src={`/static/images/${encodeURIComponent(type.model)}.webp`}
						class="img-fluid"
					/>
					{type.title} <small>({type.model})</small>
				</div>
				<div class="col-8">
					<ul>
						<li>
							You can download the firmware for the cellular module on{' '}
							<a
								href="https://www.nordicsemi.com/Products/nRF9160/Download?lang=en#infotabs"
								target="_blank"
							>
								the product page of the nRF9160
							</a>
							.
						</li>
						<li>
							<a
								href="https://infocenter.nordicsemi.com/topic/ref_at_commands/REF/at_commands/intro.html"
								target="_blank"
							>
								Basic AT Command set
							</a>
							, or try our <a href="/at-commands">advanced search</a>
						</li>
						<li>
							<a
								href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/serial_lte_modem/doc/AT_commands_intro.html#slm-at-intro"
								target="_blank"
							>
								Extended AT Command set (Serial LTE Monitor)
							</a>
						</li>
						<li>
							<a
								href="https://infocenter.nordicsemi.com/topic/ps_nrf9160/nRF9160_html5_keyfeatures.html"
								target="_blank"
							>
								nRF9160 Product Specification
							</a>
						</li>
						<li>
							<a
								href="https://infocenter.nordicsemi.com/topic/nwp_044/WP/nwp_044/intro.html"
								target="_blank"
							>
								nWP044 - Best practices for cellular IoT development
							</a>
						</li>
						<li>
							<a
								href="https://infocenter.nordicsemi.com/topic/nwp_037/WP/nwp_037/nwp_037_intro.html"
								target="_blank"
							>
								nWP037 - nRF9160 Hardware Design Guidelines
							</a>
						</li>
						<li>
							<a
								href="https://infocenter.nordicsemi.com/topic/nwp_034/WP/nwp_034/nwp_034_intro.html"
								target="_blank"
							>
								nWP034 - nRF9160 Hardware Verification Guidelines
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
)
