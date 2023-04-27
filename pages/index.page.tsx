import { Provider as CodeProvider } from '@context/Code'
import { Provider as DeviceProvider } from '@context/Device'
import { Provider as ParametersProvider } from '@context/Parameters'
import { App } from '@page/App'
import type { IndexPageProps } from './index.page.server'

export const Page = ({ dks }: IndexPageProps) => (
	<ParametersProvider>
		{() => (
			<CodeProvider>
				<DeviceProvider DKs={dks}>
					<App />
				</DeviceProvider>
			</CodeProvider>
		)}
	</ParametersProvider>
)
