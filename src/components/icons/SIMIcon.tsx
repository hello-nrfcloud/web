// w: 740.15002
// h: 871.71997

export const SIMIcon = ({
	size,
	class: c,
	...props
}: {
	size?: number
	class?: string
}) => (
	<svg
		version="1.1"
		x="0px"
		y="0px"
		viewBox="0 0 871.71997 740.15002"
		width={size ?? 22}
		height={((size ?? 22) * 871.71997) / 740.15002}
		xmlns="http://www.w3.org/2000/svg"
		class={c}
		{...props}
	>
		<path
			d="M 428.15,130.27 H 145.98 c -10.37,0 -18.78,8.41 -18.78,18.78 v 442.06 c 0,10.37 8.41,18.78 18.78,18.78 h 282.17 c 10.37,0 18.78,-8.41 18.78,-18.78 V 149.05 c 0.01,-10.37 -8.4,-18.78 -18.78,-18.78 z M 268.29,167.83 V 426.81 H 164.77 V 167.83 Z M 164.77,464.38 H 268.29 V 572.33 H 164.77 Z M 305.85,572.33 V 327.2 H 409.37 V 572.33 Z M 409.37,289.64 H 305.85 V 167.83 h 103.52 z"
			fill={'currentColor'}
		/>
		<path
			d="M 871.72,711.99 V 258.54 c 0,-6.88 -2.52,-13.53 -7.08,-18.68 L 660.66,9.5 C 655.31,3.46 647.63,0 639.57,0 H 28.17 C 12.61,0 0,12.61 0,28.17 v 683.81 c 0,15.56 12.61,28.17 28.17,28.17 h 815.38 c 15.56,0.01 28.17,-12.6 28.17,-28.16 z M 56.34,683.81 V 56.35 h 570.54 l 188.49,212.87 v 414.59 z"
			fill={'currentColor'}
		/>
	</svg>
)