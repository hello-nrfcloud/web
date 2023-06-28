import { type Device } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { Link2Icon } from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'
import { styled } from 'styled-components'
import { SecondaryLink } from './Buttons.js'
import { Danger } from './buttons/Button.js'
import { NetworkInfo } from './deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from './deviceInfo/SoftwareInfo.js'

export const NetworkModeIcon = styled.abbr`
	svg {
		max-width: 100px;
		height: auto;
	}
`

export const SelectedDK = ({
	children,
	device,
}: PropsWithChildren<{ device: Device }>) => {
	const { clear, fingerprint } = useFingerprint()

	const type = device.type

	return (
		<div class="container my-4">
			<header class="row mt-4">
				<div class="col d-flex justify-content-between align-items-center">
					<h1>
						<span>Your development kit:</span>
						<strong class="ms-1">{type.title}</strong>
						<small class="text-muted ms-1">({type.model})</small>
					</h1>
					<div>
						<SecondaryLink
							class="me-2"
							href={`https://${DOMAIN_NAME}/${fingerprint}`}
							title="Use this link to share your device with someone else"
						>
							<Link2Icon />
						</SecondaryLink>
						<Danger
							outline
							onClick={() => {
								clear()
							}}
						>
							clear
						</Danger>
					</div>
				</div>
			</header>
			{device !== undefined && (
				<div class="row mb-4">
					<section class="col">
						<NetworkInfo />
						<SoftwareInfo device={device} />
						{children}
					</section>
				</div>
			)}
		</div>
	)
}
