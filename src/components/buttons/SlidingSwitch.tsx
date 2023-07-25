export const SlidingSwitch = ({
	state,
	onClick,
	class: c,
	disabled,
}: {
	state: boolean
	onClick?: () => void
	class?: string
	disabled?: boolean
}) => {
	const height = 40
	const width = height * 1.75
	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			version={`1.1`}
			xmlns={`http://www.w3.org/2000/svg`}
			onClick={() => {
				onClick?.()
			}}
			class={c}
			cursor={disabled === true ? 'not-allowed' : 'pointer'}
		>
			<path
				d={[
					`M ${height / 2} ${height}`,
					// A  rx            ry            x-axis-rotation large-arc-flag sweep-flag x y
					`A ${height / 2} ${height / 2} 0 1 1 ${height / 2} 0`,
					`L ${width - height / 2} 0`,
					`A ${height / 2} ${height / 2} 0 1 1 ${width - height / 2} ${height}`,
					`L ${height / 2} ${height}`,
				].join(' ')}
				fill={disabled === true ? '#e4eaeb' : state ? '#8bc058' : '#d1314f'}
			/>
			{[0.95, 0.925, 0.9, 0.875, 0.85, 0.825].map((size) => (
				<circle
					r={(height / 2) * size}
					cx={state ? width - height + height / 2 : height / 2}
					cy={height / 2}
					fill="#000000"
					opacity={0.05}
				/>
			))}
			<circle
				r={(height / 2) * 0.8}
				cx={state ? width - height + height / 2 : height / 2}
				cy={height / 2}
				fill="#e4eaeb"
			/>
		</svg>
	)
}
