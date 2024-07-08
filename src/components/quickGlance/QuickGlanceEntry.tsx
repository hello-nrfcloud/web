import { SecondaryLink } from '#components/Buttons.js'
import type { ComponentChild } from 'preact'
import type { PropsWithChildren } from 'preact/compat'

export const QuickGlanceEntry = ({
	icon,
	title,
	children,
	action,
	type,
}: PropsWithChildren<{
	type: 'ok' | 'notOk' | 'warning'
	icon: (args: {
		size: number
		strokeWidth: number
		class: string
		title: string
	}) => ComponentChild
	title: string
	action?: {
		label: string
		href: string
	}
}>) => (
	<div class={`QuickGlanceEntry ${type}`}>
		<div class="p-2 d-flex align-items-center flex-row">
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
)
