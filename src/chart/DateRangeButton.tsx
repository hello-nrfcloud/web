import './DateRangeButton.css'
import cx from 'classnames'

export const DateRangeButton = ({
	onClick,
	disabled,
	label,
	active,
	class: c,
}: {
	onClick: () => unknown
	disabled: boolean
	active: boolean
	label: string
	class?: string
}) => (
	<button
		disabled={disabled}
		onClick={onClick}
		class={cx(c ?? '', 'dateRange', {
			active,
		})}
	>
		{label}
	</button>
)
