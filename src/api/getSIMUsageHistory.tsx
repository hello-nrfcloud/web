import { validatingFetch } from '#utils/validatingFetch.js'
import { Type, type Static } from '@sinclair/typebox'
import type { TimeSpan } from './api.js'
import { ts, usedBytes } from './getSIMDetails.js'

const UsageHistory = Type.Object({
	ts,
	usedBytes,
})
export const SIMHistory = Type.Object({
	measurements: Type.Array(UsageHistory),
})

export type SIMHistoryType = Static<typeof SIMHistory>
export type SIMUsageHistoryType = Static<typeof UsageHistory>

export const getSIMHistory =
	(simDetailsAPIURL: URL) => (iccid: string, timespan: TimeSpan) =>
		validatingFetch(SIMHistory)(
			new URL(
				`./sim/${iccid}/history?${new URLSearchParams({ timespan }).toString()}`,
				simDetailsAPIURL,
			),
		)
