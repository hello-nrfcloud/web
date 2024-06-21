import { useDevice } from '#context/Device.js'
import { EyeOffIcon } from 'lucide-preact'
import { Ago } from './Ago.js'
import { Secondary } from './Buttons.js'
import { useState } from 'preact/hooks'

export const HideDataBefore = () => {
	const { hideDataBefore, device } = useDevice()
	const [inProgress, setInProgress] = useState<boolean>(false)
	console.log(device?.hideDataBefore)
	return (
		<div id="device-configuration">
			<h2 class="d-flex align-items-center justify-content-between">
				<span>Hide data</span>
			</h2>
			{device?.hideDataBefore !== undefined && (
				<div class="mb-4">
					<div class={`alert alert-info problem mt-2 d-flex align-items-start`}>
						<EyeOffIcon strokeWidth={1} class={'me-1'} />
						<span class="mt-1">
							All data older than{' '}
							<Ago
								key={device.hideDataBefore.toISOString()}
								date={device.hideDataBefore}
							/>{' '}
							is hidden.
						</span>
					</div>
				</div>
			)}
			<p>
				You can hide historical data for this device. This is useful in case you
				want to hand over this device to someone else. Note that this does not
				delete historical data from our storage.
			</p>
			<p>
				<Secondary
					onClick={() => {
						hideDataBefore()
							.start(() => setInProgress(true))
							.done(() => setInProgress(false))
					}}
					disabled={inProgress}
				>
					{inProgress ? 'sending ...' : 'hide historical data until now'}
				</Secondary>
			</p>
		</div>
	)
}
