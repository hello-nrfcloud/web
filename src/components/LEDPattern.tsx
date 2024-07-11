import type { LEDPatternType } from '#content/models/types.js'
import type { Static } from '@sinclair/typebox'
import { nanoid } from 'nanoid'
import { useRef } from 'preact/hooks'

import './LEDPattern.css'

export const LEDPattern = ({
	ledPattern,
}: {
	ledPattern: Array<Static<typeof LEDPatternType>>
}) => (
	<dl class="LEDPattern">
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

const LED = ({ pattern }: { pattern: Static<typeof LEDPatternType> }) => {
	const id = useRef(nanoid())
	return (
		<>
			<style type="text/css">
				{`
					@keyframes colorChange-${id.current} {
						0% {
							background-color: #${pattern.color.toString(16).padStart(6, '0')};
						}

						50% {
							background-color: #${pattern.color.toString(16).padStart(6, '0')};
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
			<div
				class="led"
				style={{
					backgroundColor: `#${pattern.color.toString(16).padStart(6, '0')}`,
					animation: `colorChange-${id.current} ${pattern.intervalMs * 2}ms infinite alternate`,
				}}
			/>
		</>
	)
}
