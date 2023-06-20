import { useDevice } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import cx from 'classnames'
import { Code2, Fingerprint, Home } from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'
import { useState } from 'preact/hooks'
import { PreviewWarning } from './PreviewWarning.js'
import { Logo } from './icons/Logo.js'

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
	const { fingerprint } = useFingerprint()
	return (
		<>
			<Link href="/">
				<Home class="me-1" /> Home
			</Link>
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
				<Link
					href={`/device#${device.id}`}
					title="Device fingerprint was provided"
				>
					<Logo color={'white'} strokeWidth={1} class="me-1" /> Your Development
					Kit
				</Link>
			)}
			<Link href="/view-source">
				<Code2 class="me-1" /> View Source
			</Link>
		</>
	)
}
export const Navbar = () => {
	const [collapsed, setCollapsed] = useState(true)

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
						<ul class="navbar-nav">
							<Navigation />
						</ul>
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
						</div>
					</div>
				)}
			</nav>
			<PreviewWarning />
		</>
	)
}
