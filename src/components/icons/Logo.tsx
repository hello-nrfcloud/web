export const Logo = ({
	strokeWidth,
	color,
	class: className,
}: {
	strokeWidth: number
	color: string
	class?: string
}) => {
	const s = (strokeWidth ?? 2) * (0.529167 / 2)
	const c = color ?? '#00a9ce'
	return (
		<svg
			width={`34.409477`}
			height={`31.091856`}
			viewBox={`0 0 9.1041747 8.226387`}
			version={`1.1`}
			xmlns={`http://www.w3.org/2000/svg`}
			class={className}
		>
			<g id={`layer1`} transform={`translate(-51.98419,-87.73281)`}>
				<circle
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:#000000`}
					cx={`59.236233`}
					cy={`92.282242`}
					r={`0.52921253`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:#000000`}
					d={`m 56.074806,92.811454 a 0.52921253,0.52921253 0 0 1 -0.528317,-0.498441 0.52921253,0.52921253 0 0 1 0.466879,-0.556405 0.52921253,0.52921253 0 0 1 0.582611,0.433737`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers`}
					d={`m 57.29966,90.800242 v 2.011216`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers`}
					d={`m 58.003341,90.800242 v 2.011216`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:#000000`}
					d={`m 53.78349,92.282242 a 0.52921253,0.52921253 0 0 1 0.529212,-${s} 0.52921253,0.52921253 0 0 1 ${s},${s}`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers`}
					d={`m 53.783491,90.800241 v 2.011217`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers`}
					d={`m 54.841916,92.278618 v 0.53284`}
				/>
				<path
					style={`fill:none;stroke:${c};stroke-width:${s};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:#000000`}
					d={`m 56.512431,87.997479 c -1.141401,6.72e-4 -2.162712,0.709151 -2.563037,1.778046 -0.983671,0.175912 -1.700027,1.031244 -1.700597,2.03052 8.4e-5,1.139843 0.924152,2.063812 2.063994,2.063776 0.761536,0.0046 2.324894,0.0025 3.114593,2.24e-4 0.456065,-0.0013 0.590144,1.102313 -0.285746,1.824568 1.084256,-0.23399 1.761079,-0.892688 1.825748,-1.826154 0.268888,0.0013 0.17938,7.84e-4 0.268888,0.0013 0.876709,-8.4e-5 1.587402,-0.710777 1.587485,-1.587487 -4.7e-5,-0.871102 -0.701981,-1.579479 -1.573046,-1.587485 -0.0225,-1.496251 -1.241862,-2.697399 -2.738282,-2.69737 z`}
				/>
			</g>
		</svg>
	)
}
