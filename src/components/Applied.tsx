import { CheckCircle, ZapOff } from 'lucide-preact'

export const Applied = ({
	applied,
	class: c,
	size,
}: {
	class?: string
	applied: boolean
	size?: number
}) => {
	if (applied)
		return (
			<abbr
				title="The
			device has applied the configuration change."
				class={c}
			>
				<CheckCircle strokeWidth={1} class="color-success" size={size} />{' '}
				<small class="text-secondary">update applied</small>
			</abbr>
		)
	return (
		<abbr
			title="The
		device has not yet applied the configuration change."
			class={c}
		>
			<ZapOff strokeWidth={1} class="color-warning" size={size} />{' '}
			<small class="text-secondary">update pending</small>
		</abbr>
	)
}
