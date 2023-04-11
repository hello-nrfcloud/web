import { Provider as CodeProvider } from '@context/Code'
import { Provider as DeviceProvider } from '@context/Device'
import { Provider as ParametersProvider } from '@context/Parameters'
import { Provider as ResourcesProvider } from '@context/Resources'
import { App } from '@page/App'
import type { IndexPageProps } from './index.page.server'

export const Page = ({ resources, dks }: IndexPageProps) => (
	<ParametersProvider>
		{() => (
			<CodeProvider>
				<DeviceProvider DKs={dks}>
					<ResourcesProvider resources={resources}>
						<App />
					</ResourcesProvider>
				</DeviceProvider>
			</CodeProvider>
		)}
	</ParametersProvider>
)
