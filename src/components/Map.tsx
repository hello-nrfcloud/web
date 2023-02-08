import { styled } from 'styled-components'

const MapContainer = styled.div`
	aspect-ratio: 2/1;
	background: url(/static/images/map.png);
	background-color: #353636;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	aside {
		color: white;
		font-style: italic;
	}
`
export const Map = () => (
	<MapContainer>
		<aside class="container">
			<div class="row pt-4">
				<div class="col-6">
					<p>
						This is a smaller version of what then can become the new Nordic
						World. Not like Thingy World (which is a demo that needs a human to
						explain it), this map component should be self-explaining and guide
						the user through what the key takeaways are here:
					</p>
					<ul>
						<li>location (with and without cellular)</li>
						<li>
							information about the connectivity
							<ul>
								<li>Active network</li>
								<li>power savings capabilities (eDRX, PSM)</li>
								<li>SIM card</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</aside>
	</MapContainer>
)
