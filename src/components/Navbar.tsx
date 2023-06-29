import { useAppSettings } from '#context/AppSettings.js'
import { useDevice } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import cx from 'classnames'
import {
	Code2,
	Cpu,
	Fingerprint,
	Link2Icon,
	TerminalSquare,
	TrashIcon,
} from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'
import { useState } from 'preact/hooks'
import { AppUpdateNotifier } from './AppUpdateNotifier.js'
import { Transparent } from './Buttons.js'
import { PreviewWarning } from './PreviewWarning.js'
import { NRFCloudLogo } from './icons/NRFCloudLogo.js'

const Link = ({
	href,
	children,
	title,
}: PropsWithChildren<{ href: string; title?: string }>) => {
	return (
		<li class="nav-item me-2">
			<a
				class={cx('nav-link d-flex align-items-center', {
					active: document.location.href.endsWith(href),
				})}
				href={href}
				title={title}
			>
				{children}
			</a>
		</li>
	)
}
const Navigation = () => {
	const { device } = useDevice()
	const { fingerprint, clear } = useFingerprint()
	return (
		<>
			{fingerprint !== null && device === undefined && (
				<Link
					href="/recognizing-fingerprint"
					title="Device fingerprint was provided."
				>
					<span style={{ color: 'var(--color-nordic-fall)' }}>
						<Fingerprint class="me-1" size={22} /> Checking fingerprint...
					</span>
				</Link>
			)}
			{fingerprint !== null && device !== undefined && (
				<>
					<Link
						href={`/device#${device.id}`}
						title="Device fingerprint was provided"
					>
						<Cpu class="me-1" /> Your Development Kit
					</Link>
					<Transparent
						onClick={() => {
							clear()
						}}
						class="fw-light text-muted me-1 d-flex align-items-center"
					>
						<TrashIcon class="me-1" /> Forget Development Kit
					</Transparent>
					<Link
						href={`https://${DOMAIN_NAME}/${fingerprint}`}
						title="Use this link to share your device with someone else"
					>
						<Link2Icon class="me-1" /> Share
					</Link>
				</>
			)}
			<Link href="/view-source">
				<Code2 class="me-1" /> View Source
			</Link>
		</>
	)
}

const DeveloperMenu = ({ onClick }: { onClick?: () => void }) => {
	const { terminalVisible, showTerminal } = useAppSettings()
	return (
		<>
			{!terminalVisible && (
				<Transparent
					onClick={() => {
						showTerminal(true)
						onClick?.()
					}}
				>
					<TerminalSquare /> show terminal
				</Transparent>
			)}
			{terminalVisible && (
				<Transparent
					onClick={() => {
						showTerminal(false)
						onClick?.()
					}}
				>
					<TerminalSquare /> hide terminal
				</Transparent>
			)}
		</>
	)
}

export const Navbar = () => {
	const [collapsed, setCollapsed] = useState(true)
	const { devModeEnabled } = useAppSettings()

	return (
		<>
			<nav class="navbar navbar-expand-lg position-fixed top-0 z-3 bg-light w-100">
				<div class="container">
					<a class="navbar-brand" href="/">
						<img
							src={`/static/images/logo.svg?v=${VERSION}`}
							alt="Logo"
							width="30"
							height="24"
							class="d-inline-block align-text-top me-1"
						/>
						hello.nrfcloud.com
					</a>
					<div class="collapse navbar-collapse" id="navbarNav">
						<div class="navbar-nav d-flex justify-content-between w-100">
							<div class="d-flex">
								<Navigation />
							</div>
							{devModeEnabled && (
								<div class="d-flex">
									<DeveloperMenu />
								</div>
							)}
						</div>
					</div>
					<button
						class="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
						onClick={() => setCollapsed((c) => !c)}
					>
						<span class="navbar-toggler-icon"></span>
					</button>
				</div>
				{!collapsed && (
					<div
						class="offcanvas offcanvas-end show"
						tabIndex={-1}
						id="offcanvasNavbar"
						aria-labelledby="offcanvasNavbarLabel"
					>
						<div class="offcanvas-header">
							<h5 class="offcanvas-title" id="offcanvasNavbarLabel">
								<img
									src={`/static/images/logo.svg?v=${VERSION}`}
									alt="Logo"
									width="30"
									height="24"
									class="d-inline-block align-text-top me-1"
								/>
								hello.nrfcloud.com
							</h5>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="offcanvas"
								aria-label="Close"
								onClick={() => setCollapsed(true)}
							></button>
						</div>
						<div class="offcanvas-body">
							<ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
								<Navigation />
							</ul>
							{devModeEnabled && (
								<>
									<hr />
									<DeveloperMenu
										onClick={() => {
											setCollapsed(true)
										}}
									/>
								</>
							)}

							<hr />
							<p>
								<a
									href="https://nrfcloud.com/"
									class="text-body-tertiary text-decoration-none"
									target="_blank"
								>
									<NRFCloudLogo style={{ height: '18px' }} />
								</a>
							</p>
						</div>
					</div>
				)}
			</nav>
			<PreviewWarning />
			<AppUpdateNotifier />
		</>
	)
}
