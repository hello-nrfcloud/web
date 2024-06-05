import { CloudUpload } from 'lucide-preact'
import { DeviceBehaviourInfo } from './DeviceBehaviourInfo.js'

export const ConnectionSuccess = () => (
	<section class="mt-4">
		<h2>
			Success! <CloudUpload />
		</h2>
		<p>
			Your device connected and is sending data to the cloud! You can learn more
			about some of it's features below.
		</p>
		<DeviceBehaviourInfo />
	</section>
)
