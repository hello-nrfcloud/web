import { TimeSpan } from '#api/api.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export const HistoryChartContext = createContext<{
	timeSpan: TimeSpan
	setTimeSpan: (type: TimeSpan) => void
}>({
	timeSpan: TimeSpan.lastHour,
	setTimeSpan: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)

	return (
		<HistoryChartContext.Provider
			value={{
				timeSpan,
				setTimeSpan,
			}}
		>
			{children}
		</HistoryChartContext.Provider>
	)
}

export const Consumer = HistoryChartContext.Consumer

export const useHistoryChart = () => useContext(HistoryChartContext)
