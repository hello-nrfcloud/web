import { timeSpans, type TimeSpanInfo } from '#chart/timeSpans.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import { HistoryIcon } from 'lucide-preact'
import { useState } from 'preact/hooks'
import type { TimeSpan } from '#api/api.js'

const byTimeSpan = (timeSpan: TimeSpan | undefined) => (t: TimeSpanInfo) =>
	t.id === timeSpan

export const HistoryControls = () => {
	const { timeSpan, setTimeSpan } = useDeviceLocation()
	const [expanded, setExpanded] = useState<boolean>(false)

	if (!expanded) {
		return (
			<div
				class="mt-2 d-flex justify-content-start align-items-center controls"
				style={{ color: 'var(--color-nordic-dark-grey)' }}
			>
				<HistoryIcon class="ms-2" />
				<button
					type="button"
					class="control"
					onClick={() => {
						setExpanded(true)
					}}
					disabled={true}
				>
					<span>
						History: {timeSpans.find(byTimeSpan(timeSpan))?.title ?? 'off'}
					</span>
				</button>
			</div>
		)
	}

	return (
		<div
			class="mt-2 d-flex justify-content-start align-items-center controls horizontal"
			style={{ color: 'var(--color-nordic-dark-grey)' }}
		>
			<HistoryIcon class="ms-2" title={'History'} />
			<button
				type="button"
				class="control"
				onClick={() => {
					setTimeSpan()
					setExpanded(false)
				}}
			>
				off
			</button>
			{timeSpans.map(({ id, title }) => (
				<button
					type="button"
					class="control ms-1"
					onClick={() => {
						setTimeSpan(id)
						setExpanded(false)
					}}
				>
					{title}
				</button>
			))}
		</div>
	)
}
