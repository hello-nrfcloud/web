export const DeviceBehaviourInfo = () => (
	<>
		<h2>We have to talk about ultra-low power...</h2>
		<p>
			We have provided some sensible defaults for this firmware that is
			optimized for this quick check, more specifically:
		</p>
		<ul>
			<li>
				GNSS is disabled by default because you most likely are using the device
				for the first time from your desk indoors. GNSS reception is usually not
				possible there. You can enable GNSS using the{' '}
				<a href="#device-configuration">device configuration</a> section below.
			</li>
			<li>
				After boot, the device enters a temporary real-time mode for 10 minutes.
				In this mode, the device polls for configuration changes every 30
				seconds and sends sensor updates every minute.
			</li>
			<li>
				After this time has passed, the device enters the default low-power mode
				with an update interval of 1 hour.
			</li>
			<li>
				You can put the device back in temporary real-time mode by pressing the
				button.
			</li>
			<li>
				The device will also stay in the temporary real-time mode if it receives
				a message from the cloud during this time, e.g. if you change the LED
				state.
			</li>
			<li>
				You can change the default low-power mode using the{' '}
				<a href="#device-configuration">device configuration</a> section below.{' '}
			</li>
		</ul>
	</>
)
