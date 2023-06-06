import cx from 'classnames'
import { useState } from 'preact/hooks'
import { PreviewWarning } from './PreviewWarning.js'

const Link = ({ href, label }: { href: string; label: string }) => {
	return (
		<li class="nav-item">
			<a
				class={cx('nav-link', {
					active: document.location.href.endsWith(href),
				})}
				href={href}
			>
				{label}
			</a>
		</li>
	)
}
const Navigation = () => (
	<>
		<Link href="/" label="Home" />
		<Link href="/view-source" label="View Source" />
	</>
)
export const Navbar = () => {
	const [collapsed, setCollapsed] = useState(true)

	return (
		<>
			<nav class="navbar navbar-expand-lg position-fixed top-0 z-3 bg-light w-100">
				<div class="container">
					<a class="navbar-brand" href="/">
						<img
							src="/static/images/logo.svg"
							alt="Logo"
							width="30"
							height="24"
							class="d-inline-block align-text-top me-1"
						/>
						Muninn
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
									src="/static/images/logo.svg"
									alt="Logo"
									width="30"
									height="24"
									class="d-inline-block align-text-top me-1"
								/>
								Muninn
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
