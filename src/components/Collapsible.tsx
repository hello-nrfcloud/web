import cx from 'classnames'
import { HelpCircle, X } from 'lucide-preact'
import { nanoid } from 'nanoid'
import type { ComponentChildren } from 'preact'
import { useRef, useState } from 'preact/hooks'

import './Collapsible.css'

export const Collapsible = ({
	children,
	title,
	collapsed,
	icon,
	class: className,
	moreText,
}: {
	children: ComponentChildren
	title: ComponentChildren
	collapsed?: boolean
	icon?: ComponentChildren
	class?: string
	moreText?: string
}) => {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed ?? true)
	const id = useRef(nanoid())

	return (
		<section
			class={cx('collapsible', className, { collapsed: isCollapsed })}
			id={id.current}
		>
			<header>
				{title}
				<button
					type="button"
					class="btn btn-link"
					onClick={() => setIsCollapsed(!isCollapsed)}
					title={isCollapsed ? (moreText ?? 'show more') : 'close'}
					aria-controls={id.current}
				>
					{isCollapsed ? icon === undefined ? <HelpCircle /> : icon : <X />}
				</button>
			</header>
			{!isCollapsed && <main>{children}</main>}
		</section>
	)
}
