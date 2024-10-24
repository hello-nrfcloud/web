import { AppUpdateNotifier } from '#components/AppUpdateNotifier.js'
import { BrandHeader } from '#components/BrandHeader.js'
import { Transparent } from '#components/Buttons.js'
import { Logo } from '#components/icons/Logo.js'
import { NRFCloudLogo } from '#components/icons/NRFCloudLogo.js'
import { PublicDeviceWarning } from '#components/PublicDeviceWarning.js'
import { useDevice } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { isSSR } from '#utils/isSSR.js'
import cx from 'classnames'
import { debounce } from 'lodash-es'
import {
	Code2,
	Cpu,
	Fingerprint,
	ListTree,
	MapPinned,
	TrashIcon,
} from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'

const Link = ({
	href,
	children,
	title,
	target,
}: PropsWithChildren<{ href: string; title?: string; target?: string }>) => (
	<a
		class={cx('me-2 nav-link d-flex align-items-center', {
			active: isSSR ? false : document.location.href.endsWith(href),
		})}
		href={href}
		title={title}
		target={target}
	>
		{children}
	</a>
)
const Navigation = () => {
	const { device, debug, setDebug, unsupported } = useDevice()
	const { fingerprint, clear } = useFingerprint()
	return (
		<>
			{fingerprint !== null &&
				device === undefined &&
				unsupported === undefined && (
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
					<Link href={`/device`} title="Device fingerprint was provided">
						<Cpu class="me-1" /> Your device
					</Link>
					<Transparent
						onClick={() => {
							clear()
						}}
						class="fw-light text-muted me-1 d-flex align-items-center"
					>
						<TrashIcon class="me-1" /> Forget device
					</Transparent>
					{device.model.map?.model !== undefined && (
						<Link
							href={`https://hello.nrfcloud.com/map/dashboard/#add-device?${new URLSearchParams({ fingerprint, model: device.model.map.model }).toString()}`}
							title="Make your device available to the public"
							target="_blank"
						>
							<MapPinned class="me-1" /> Share device
						</Link>
					)}
				</>
			)}
			{device !== undefined &&
				(document.location.pathname.endsWith('/device/') ||
					document.location.pathname.endsWith('/device')) && (
					<span class="d-none d-sm-inline">
						{!debug && (
							<button
								class="me-2 nav-link align-items-center  d-md-flex"
								type="button"
								onClick={() => setDebug(true)}
							>
								<ListTree class="me-1" /> Show LwM2M Objects
							</button>
						)}
					</span>
				)}

			<Link href="/view-source">
				<Code2 class="me-1" /> View Source
			</Link>
		</>
	)
}

export const Navbar = () => (
	<>
		<NavWrapper />
		<AppUpdateNotifier />
		<PublicDeviceWarning />
	</>
)

const NavWrapper = () => {
	const [scrolling, setScrolling] = useState<boolean>(false)
	const [isDesktop, setIsDesktop] = useState<boolean>(false)

	useEffect(() => {
		const scrollWatch = debounce(() => {
			setScrolling((window?.scrollY ?? 0) > 175 + 56)
		}, 250)
		window?.addEventListener('scroll', scrollWatch)

		return () => {
			window?.removeEventListener('scroll', scrollWatch)
		}
	}, [])

	useEffect(() => {
		setIsDesktop((window?.innerWidth ?? 0) > 768)
	}, [])

	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		if (body === undefined) return
		if (isDesktop) {
			body.className = (body.className ?? '') + ' desktop'
		}
	}, [isDesktop])

	if (isDesktop) {
		if (!scrolling) {
			return (
				<>
					<BrandHeader />
					<Nav />
				</>
			)
		}
		return (
			<>
				<BrandHeader />
				<Nav key="nav-inline" />
				<Nav key="nav-fixed" fixed />
			</>
		)
	} else {
		return <Nav fixed />
	}
}

const Nav = ({ fixed }: { fixed?: boolean }) => {
	const [collapsed, setCollapsed] = useState(true)

	return (
		<nav
			class={cx('navbar navbar-expand-lg top-0 z-3 bg-light w-100', {
				'position-fixed': fixed ?? false,
			})}
		>
			<div class="container">
				<a class="navbar-brand fw-light" href="/">
					<Logo
						class="d-inline-block align-text-top me-2"
						style={{
							width: '30',
							height: '24',
							color: 'var(--color-nordic-blue)',
						}}
					/>
					hello.nrfcloud.com
				</a>
				<div class="collapse navbar-collapse" id="navbarNav">
					<div class="navbar-nav d-flex justify-content-between w-100">
						<div class="d-flex">
							<Navigation />
						</div>
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
						<h5 class="offcanvas-title fw-light" id="offcanvasNavbarLabel">
							<Logo
								class="d-inline-block align-text-top me-2"
								style={{
									width: '30',
									height: '24',
									color: 'var(--color-nordic-blue)',
								}}
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
						<div class="navbar-nav justify-content-end flex-grow-1 pe-3">
							<Navigation />
						</div>
						<hr />
						<p>
							<a
								href="https://nrfcloud.com/"
								class="text-body-secondary text-decoration-none"
								target="_blank"
							>
								<NRFCloudLogo style={{ height: '18px' }} />
							</a>
						</p>
					</div>
				</div>
			)}
		</nav>
	)
}
