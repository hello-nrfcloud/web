import { Github, Laptop2 } from 'lucide-preact'

export const Footer = () => (
	<footer
		style={{
			backgroundColor: 'var(--color-nordic-dark-grey)',
		}}
		class="pt-4 pb-4"
	>
		<div class="container pt-4 pb-4 text-light">
			<div class="row">
				<div class="col">
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
						<a
							href="https://devzone.nordicsemi.com/"
							target="_blank"
							class="btn btn-secondary"
						>
							devzone.nordicsemi.com
						</a>
					</p>
					<p>
						Additionally, you can find a variety of tutorials and blog posts:
					</p>
					<ul>
						<li>
							<a
								href="https://devzone.nordicsemi.com/guides/cellular-iot-guides/"
								target="_blank"
								class="text-white"
							>
								Cellular IoT guides
							</a>{' '}
							(<em>important guides should be integrated above</em>)
						</li>
					</ul>
				</div>
				<div class="col">
					<p class="mt-4 mb-4">
						<Github
							strokeWidth={1}
							style={{ width: '100px', height: '100px' }}
						/>
					</p>
					<h2>Nordic Semiconductor on Github</h2>
					<ul>
						<li>
							<a
								href="https://github.com/NordicSemiconductor"
								target="_blank"
								class="text-white"
							>
								<code>NordicSemiconductor</code>
							</a>
							: Officially supported repositories
						</li>
						<li>
							<a
								href="https://github.com/NordicPlayground"
								target="_blank"
								class="text-white"
							>
								<code>NordicPlayground</code>
							</a>
							: Emerging and unsupported projects
						</li>
						<li>
							<a
								href="https://github.com/sdk-nrf"
								target="_blank"
								class="text-white"
							>
								<code>sdk-nrf</code>
							</a>
							: nRF Connect SDK
						</li>
					</ul>
				</div>
				<div class="col">
					<p class="mt-4 mb-4">
						<Laptop2
							strokeWidth={1}
							style={{ width: '100px', height: '100px' }}
						/>
					</p>
					<h2>Important Tools</h2>
					<ul>
						<li>
							<a
								href="https://nrfconnect.github.io/vscode-nrf-connect/"
								target="_blank"
								class="text-white"
							>
								nRF Connect SDK for Visual Studio Code
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
)
