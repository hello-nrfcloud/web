import type { LEDPatternType } from '#content/models/types.js'
import type { WithTestId } from '#utils/WithTestId.js'
import type { Static } from '@sinclair/typebox'
import cx from 'classnames'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'preact/hooks'

import './LEDPattern.css'

export const LEDPattern = ({
	ledPattern,
}: {
	ledPattern: Array<Static<typeof LEDPatternType>>
}) => {
	const [highlight, setHighlight] = useState(0)

	const clickHandler = (index: number) => (): void => {
		setHighlight(index)
	}

	useEffect(() => {
		const t = setTimeout(
			() => {
				setHighlight((highlight) => (highlight + 1) % ledPattern.length)
			},
			(ledPattern[highlight]?.intervalMs ?? 5000) * 10,
		)
		return () => clearTimeout(t)
	}, [highlight])

	return (
		<dl class={'ledPattern'}>
			{ledPattern.map((pattern, index) => {
				const isHighlight = highlight === index
				return (
					<>
						<dt
							class={cx({ highlight: isHighlight })}
							onClick={clickHandler(index)}
						>
							<LED pattern={pattern} highlight={isHighlight} />
						</dt>
						<dd
							class={cx({ highlight: isHighlight })}
							onClick={clickHandler(index)}
						>
							{pattern.description}
						</dd>
					</>
				)
			})}
		</dl>
	)
}
export const LED = ({
	pattern,
	class: className,
	highlight,
	...rest
}: {
	class?: string
	pattern: Static<typeof LEDPatternType>
	/**
	 * If true, the LED will be animated.
	 */
	highlight: boolean
} & WithTestId) => {
	const id = useRef(nanoid())
	return (
		<>
			<style type="text/css">
				{`
					@keyframes colorChange-${id.current} {
						0% {
							background-color: #${hexToRGB(pattern.color)};
						}

						50% {
							background-color: #${hexToRGB(pattern.color)};
						}

						51% {
							background-color: #AAA;
						}

						100% {
							background-color: #AAA;
						}
					}
				`}
			</style>
			<abbr
				class={cx(`led`, className, { highlight })}
				{...rest}
				style={{
					backgroundColor: highlight ? `#${hexToRGB(pattern.color)}` : '#AAA',
					animation: highlight
						? `colorChange-${id.current} ${pattern.intervalMs * 2}ms infinite alternate`
						: 'none',
					borderRadius: '100%',
					border: '1px solid #ccc',
					width: '18px',
					height: '18px',
					display: 'inline-block',
				}}
				title={pattern.description}
			/>
		</>
	)
}

/**
 * Example: 0xffffff
 */
export const hexToRGB = (color: number): string =>
	color.toString(16).padStart(6, '0')
