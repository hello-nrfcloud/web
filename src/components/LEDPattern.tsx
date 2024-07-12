import type { LEDPatternType } from '#content/models/types.js'
import type { WithTestId } from '#utils/WithTestId.js'
import type { Static } from '@sinclair/typebox'
import { nanoid } from 'nanoid'
import { useRef } from 'preact/hooks'

export const LEDPattern = ({
	ledPattern,
}: {
	ledPattern: Array<Static<typeof LEDPatternType>>
}) => (
	<dl
		style={{
			display: 'grid',
			gridTemplateColumns: 'minmax(5%, 30px) auto',
		}}
	>
		{ledPattern.map((pattern) => (
			<>
				<dt>
					<LED pattern={pattern} />
				</dt>
				<dd>{pattern.description}</dd>
			</>
		))}
	</dl>
)

export const LED = ({
	pattern,
	class: className,
	...rest
}: {
	class?: string
	pattern: Static<typeof LEDPatternType>
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
				class={`led ${className ?? ''}`}
				{...rest}
				style={{
					backgroundColor: `#${hexToRGB(pattern.color)}`,
					animation: `colorChange-${id.current} ${pattern.intervalMs * 2}ms infinite alternate`,
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
