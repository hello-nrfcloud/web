import { Ago } from '#components/Ago.js'
import { WaitingForData } from '#components/WaitingForData.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice } from '#context/Device.js'
import { SIMVendor } from '#context/Models.js'
import { BatteryFull, CloudOff, RadioTower, ToggleRight } from 'lucide-preact'

export const ConnectDevice = () => {
	const {
		lastSeen,
		device,
		configuration: { reported },
	} = useDevice()
	const hasIBasisSIM = device?.model.includedSIM?.find(
		({ vendor }) => vendor === SIMVendor.iBasis,
	)
	const hasOnomondoSIM = device?.model.includedSIM?.find(
		({ vendor }) => vendor === SIMVendor.onomondo,
	)
	const hasWirelessLogicSIM = device?.model.includedSIM?.find(
		({ vendor }) => vendor === SIMVendor.WirelessLogic,
	)

	const hasSIM = hasIBasisSIM ?? hasOnomondoSIM ?? hasWirelessLogicSIM

	return (
		<div class="py-4 bg-light">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<h2>
							Please follow these steps to start retrieving real-time data from
							your kit:
						</h2>
						<section class="mt-4">
							<div class="row">
								<div class="col-12 col-lg-6">
									<p>
										<BatteryFull class="me-2" />
										Make sure the battery is charged.
										<br />
										<small>
											To be safe, you can plug the device in using a micro USB
											cable.
										</small>
									</p>
									<p>
										<ToggleRight class="me-2" />
										Turn the kit on
									</p>
									{hasSIM && (
										<>
											<p>
												<SIMIcon class="me-2" /> Insert a SIM card
											</p>
											{(device?.model?.includedSIM?.length ?? 0) > 1 && (
												<p>
													<small>
														This model comes with{' '}
														{device?.model?.includedSIM?.length}{' '}
														<strong>pre-activated</strong> SIM cards. You can
														choose which one to use.
													</small>
												</p>
											)}
											<p>
												<RadioTower class="me-2" /> Sufficient data left on the
												SIM?
											</p>
											<p>{hasIBasisSIM && <IBasisSIMInfo />}</p>
											<p>{hasOnomondoSIM && <OnomondoSIMInfo />}</p>
											<p>{hasWirelessLogicSIM && <WirelessLogicSIMInfo />}</p>
										</>
									)}
								</div>
								<div class="col-12 col-lg-6">
									<p>
										<WaitingForData />
										<br />
										<small class="text-muted">
											Your device should send data to the cloud every{' '}
											{reported?.updateIntervalSeconds ??
												device?.model.defaultConfiguration
													.updateIntervalSeconds}{' '}
											seconds.
										</small>
									</p>
									{lastSeen === undefined && (
										<p>
											<CloudOff /> The device has not yet connected to the
											cloud.
										</p>
									)}
									{lastSeen !== undefined && (
										<p>
											<span>
												<Ago date={lastSeen} strokeWidth={2} size={24} /> ago
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
					</div>
				</div>
			</div>
		</div>
	)
}

const IBasisSIMInfo = () => (
	<small>
		This model comes with a <strong>pre-activated</strong>{' '}
		<a
			href="https://ibasis.com/solutions/esim-technology/"
			target="_blank"
			rel="noreferrer noopener"
		>
			SIM card from iBasis
		</a>
		. You may run of data depending on your usage. You can check the the amount
		of data left on your SIM card{' '}
		<a
			href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/device_guides/working_with_nrf/nrf91/thingy91_gsg.html#connecting-to-nrf-cloud"
			target="_blank"
			rel="noreferrer noopener"
		>
			by adding the SIM to your nRF Cloud account
		</a>
		.
	</small>
)

const OnomondoSIMInfo = () => (
	<small>
		This model comes with a <strong>pre-activated</strong>{' '}
		<a
			href="https://onomondo.com/go/nordic-dev-kit/#form"
			target="_blank"
			rel="noreferrer noopener"
		>
			SIM card from onomondo
		</a>
		. You may run of data depending on your usage. You can check the the amount
		of data left on your SIM card by registering for a free onomondo account.
	</small>
)

const WirelessLogicSIMInfo = () => (
	<small>
		This model comes with a <strong>pre-activated</strong>{' '}
		<a
			href="https://www.wirelesslogic.com/iot-solutions/"
			target="_blank"
			rel="noreferrer noopener"
		>
			SIM card from Wireless Logic
		</a>
		. You may run of data depending on your usage. You can check the the amount
		of data left on your SIM card by registering for a free Wireless Logic
		account.
	</small>
)
