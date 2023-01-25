import { Provider as DeviceProvider } from '@context/Device'
import { formatDistanceToNow } from 'date-fns'
import { render } from 'preact'
import { App } from './App'

console.debug('version', VERSION)
console.debug(
	'build time',
	BUILD_TIME,
	formatDistanceToNow(new Date(BUILD_TIME), {
		addSuffix: true,
	}),
)

const root = document.getElementById('root')

if (root === null) {
	console.error(`Could not find root element!`)
} else {
	render(
		<DeviceProvider>
			<App />
		</DeviceProvider>,
		root,
	)
}
