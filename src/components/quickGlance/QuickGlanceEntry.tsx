import { SecondaryLink } from '#components/Buttons.js'
import { type LucideIcon } from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'

import './QuickGlanceEntry.css'

export const QuickGlanceEntry = ({
	icon,
	title,
	children,
	action,
	type,
}: PropsWithChildren<{
	type: 'ok' | 'notOk' | 'warning'
	icon: LucideIcon
	title: string
	action?: {
		label: string
		href: string
	}
}>) => (
	<div style={styleForType(type)} class="QuickGlanceEntry">
		<div class="container">
			<div class="row">
				<div class="col-12 col-lg-8 py-2 d-flex align-items-center flex-row">
					<span class="icon" style={{ opacity: 0.8 }}>
						{icon({ size: 36, strokeWidth: 1, class: 'me-2', title })}
					</span>
					<div class="d-flex align-items-center justify-content-between flex-grow-1">
						<p class="m-0 me-3">{children}</p>
						{action && (
							<SecondaryLink outline href={action.href}>
								{action.label}
							</SecondaryLink>
						)}
					</div>
				</div>
			</div>
		</div>
	</div>
)
const styleForType = (type: string) => {
	switch (type) {
		case 'ok':
			return {
				backgroundColor: 'var(--color-status-ok)',
				color: 'var(--text-color-status-ok)',
			}
		case 'notOk':
			return {
				backgroundColor: 'var(--color-status-problem)',
				color: 'var(--text-color-status-problem)',
			}
		case 'warning':
			return {
				backgroundColor: 'var(--color-status-warning)',
				color: 'var(--text-color-status-warning)',
			}
		default:
			return {}
	}
}
