import cx from 'classnames'
import './DateRangeButton.css'

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
