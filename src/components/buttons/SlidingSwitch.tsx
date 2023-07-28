import { generateUUID } from '#utils/generateUUID.js'
import { useRef, useState } from 'preact/hooks'

export const SlidingSwitch = ({
	onChange,
	class: c,
	disabled,
	value,
}: {
	onChange?: (value: boolean) => void
	class?: string
	disabled?: boolean
	value?: boolean
}) => {
	const height = 40
	const width = height * 1.85
	const fontSize = height / 3
	const [state, setState] = useState<boolean>(value ?? false)
	const defaultKey = useRef<string>(generateUUID())
	const [key, setKey] = useState<string>(defaultKey.current)
	const hasChange = key !== defaultKey.current
	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			version={`1.1`}
			xmlns={`http://www.w3.org/2000/svg`}
			onClick={() => {
				if (disabled === true) return
				setState((s) => {
					onChange?.(!s)
					return !s
				})
				setKey(generateUUID())
			}}
			class={c}
			cursor={disabled === true ? 'not-allowed' : 'pointer'}
			style={{ userSelect: 'none' }}
			key={key}
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
			>
				{hasChange && (
					<Animate
						attributeName="fill"
						to="#8bc058"
						from="#d1314f"
						state={state}
					/>
				)}
			</path>
			{state === true && (
				<text
					x={height / 2}
					y={height / 2 + fontSize / 3}
					text-anchor="middle"
					alignment-baseline="center"
					fontSize={fontSize}
					fontWeight={'bold'}
					fill={disabled === true ? 'gray' : 'black'}
				>
					ON
				</text>
			)}
			{state === false && (
				<text
					x={width - height / 2}
					y={height / 2 + fontSize / 3}
					text-anchor="middle"
					alignment-baseline="center"
					fontSize={fontSize}
					fill={disabled === true ? 'gray' : 'white'}
					fontWeight={'bold'}
				>
					OFF
				</text>
			)}
			{[0.95, 0.925, 0.9, 0.875, 0.85, 0.825].map((size) => (
				<circle
					r={(height / 2) * size}
					cx={state ? width - height + height / 2 : height / 2}
					cy={height / 2}
					fill="#000000"
					opacity={0.05}
				>
					{hasChange && (
						<Animate
							attributeName="cx"
							from={height / 2}
							to={width - height + height / 2}
							state={state}
						/>
					)}
				</circle>
			))}
			<circle
				r={(height / 2) * 0.8}
				cx={state ? width - height + height / 2 : height / 2}
				cy={height / 2}
				fill="#e4eaeb"
			>
				{hasChange && (
					<Animate
						attributeName="cx"
						from={height / 2}
						to={width - height + height / 2}
						state={state}
					/>
				)}
			</circle>
		</svg>
	)
}

const Animate = ({
	state,
	attributeName,
	from,
	to,
}: {
	state: boolean
	from: string | number
	to: string | number
	attributeName: string
}) => (
	<>
		{state === true && (
			<animate
				attributeName={attributeName}
				dur="125ms"
				repeatCount="1"
				from={from}
				to={to}
			/>
		)}
		{state === false && (
			<animate
				attributeName={attributeName}
				dur="125ms"
				repeatCount="1"
				from={to}
				to={from}
			/>
		)}
	</>
)
