import { SecondaryLink } from '@components/Button'

export const Footer = () => (
	<footer
		style={{
			backgroundColor: 'var(--color-nordic-dark-grey)',
		}}
		class="pt-4 pb-4"
	>
		<div class="container pt-4 pb-4 text-light">
			<div class="row">
				<div class="col-4">
					<p>
						<a href="https://devzone.nordicsemi.com/" target="_blank">
							<img
								src="/static/images/devzone-white.svg"
								alt="{DevZone"
								width="250"
								height="150"
							/>
						</a>
					</p>
					<h2>Get support</h2>
					<p>
						In case you have any question, reach out to our community or create
						a private support ticket.
					</p>
					<p>
						<SecondaryLink
							href="https://devzone.nordicsemi.com/"
							target="_blank"
						>
							devzone.nordicsemi.com
						</SecondaryLink>
					</p>
				</div>
			</div>
		</div>
	</footer>
)
