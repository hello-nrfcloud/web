import { useDevice } from '#context/Device.js'

export const UnsupportedDevice = () => {
	const { unsupported } = useDevice()
	if (unsupported === undefined) return null
	return (
		<>
			<h2>Unsupported model</h2>
			<p>
				The application does not support the model specified for this device (
				<code>{unsupported.id}</code>).
			</p>
		</>
	)
}
