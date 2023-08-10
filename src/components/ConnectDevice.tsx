import { Ago } from '#components/Ago.js'
import { type Device } from '#context/Device.js'
import { WaitingForData } from '#components/WaitingForData.js'
import { BatteryFull, CloudOff, ToggleRight } from 'lucide-preact'
import { SIMIcon } from '#components/icons/SIMIcon.js'

export const ConnectDevice = ({ device }: { device: Device }) => (
	<>
		<h2>
			Please follow these stops to start retrieving real-time data from your
			kit:
		</h2>
		<section class="mt-4">
			<div class="row">
				<div class="col-12 col-lg-6">
					<p>
						<BatteryFull class="me-2" />
						Make sure the battery is charged.
						<br />
						<small>
							To be safe, you can plug the device in using a micro USB cable.
						</small>
					</p>
					<p>
						<ToggleRight class="me-2" />
						Turn the kit on
					</p>
					<p>
						<SIMIcon class="me-2" /> Sufficient data left on the SIM?
						<br />
						<small>
							This model comes with a <strong>pre-activated</strong>{' '}
							<a
								href="https://ibasis.com/solutions/esim-technology/"
								target="_blank"
								rel="noreferrer noopener"
							>
								SIM card from iBasis
							</a>
							. You may run of data depending on your usage. You can check the
							the amount of data left on your SIM card{' '}
							<a
								href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/device_guides/working_with_nrf/nrf91/thingy91_gsg.html#connecting-to-nrf-cloud"
								target="_blank"
								rel="noreferrer noopener"
							>
								by adding the SIM to your nRF Cloud account
							</a>
							.
						</small>
					</p>
				</div>
				<div class="col-12 col-lg-6">
					<p>
						<WaitingForData />
						<br />
						<small class="text-muted">
							Your device should send data to the cloud every 60 seconds.
						</small>
					</p>
					{device.lastSeen === undefined && (
						<p>
							<CloudOff /> The device has not yet connected to the cloud.
						</p>
					)}
					{device.lastSeen !== undefined && (
						<p>
							<span>
								<Ago date={device.lastSeen} strokeWidth={2} size={24} /> ago
							</span>
							<br />
							<small class="text-muted">
								was when the device has last sent data to the cloud
							</small>
						</p>
					)}
				</div>
			</div>
		</section>
	</>
)
