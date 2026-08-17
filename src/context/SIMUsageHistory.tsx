import {
	getSIMHistory,
	type SIMUsageHistoryType,
} from '#api/getSIMUsageHistory.ts'
import { useParameters } from '#context/Parameters.tsx'
import { useSIMDetails } from '#context/SIMDetails.tsx'
import { byTs } from '#utils/byTs.ts'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useHistoryChart } from './HistoryChart.tsx'

export type SIMUsageHistory = {
	ts: Date
	usedBytes: number
}

export type SIMUsageHistoryReadings = Array<SIMUsageHistory>

export const SIMUsageHistoryContext = createContext<{
	history: SIMUsageHistoryReadings
}>({
	history: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onParameters } = useParameters()
	const { iccid } = useSIMDetails()
	const { timeSpan } = useHistoryChart()

	const [history, setHistory] = useState<SIMUsageHistoryReadings>([])

	useEffect(() => {
		if (iccid === undefined) return

		onParameters(({ simDetailsAPIURL }) =>
			getSIMHistory(new URL(simDetailsAPIURL))(iccid, timeSpan)
				.ok(({ measurements }) => {
					setHistory(measurements.map(toHistory).sort(byTs))
				})
				.problem(({ problem }, response) => {
					if (response?.response.status === 404) {
						setHistory([]) // In case the SIM was changed
					} else {
						console.error(`[SIMUsageHistory]`, problem, response)
					}
				}),
		)
	}, [timeSpan, iccid])

	return (
		<SIMUsageHistoryContext.Provider
			value={{
				history,
			}}
		>
			{children}
		</SIMUsageHistoryContext.Provider>
	)
}

export const Consumer = SIMUsageHistoryContext.Consumer

export const useSIMUsageHistory = () => useContext(SIMUsageHistoryContext)

const toHistory = ({
	ts,
	usedBytes,
}: SIMUsageHistoryType): SIMUsageHistory => ({ ts: new Date(ts), usedBytes })
