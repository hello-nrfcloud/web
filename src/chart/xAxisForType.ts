import { TimeSpan } from '#api/api.js'
import type { XAxis } from '#chart/chartMath.js'
import { format } from 'date-fns'

export const xAxisForType = (type: TimeSpan): XAxis => {
	if (type === TimeSpan.lastMonth)
		return {
			color: 'var(--color-nordic-light-grey)',
			hideLabels: false,
			labelEvery: 24 * 60 * 2,
			minutes: 60 * 24 * 31,
			format: (d) => format(d, 'd.'),
		}
	if (type === TimeSpan.lastWeek)
		return {
			color: 'var(--color-nordic-light-grey)',
			hideLabels: false,
			labelEvery: 24 * 60,
			minutes: 60 * 24 * 7,
			format: (d) => format(d, 'd.'),
		}
	if (type === TimeSpan.lastDay)
		return {
			color: 'var(--color-nordic-light-grey)',
			hideLabels: false,
			labelEvery: 2 * 60,
			minutes: 60 * 24,
			format: (d) => format(d, 'HH'),
		}
	return {
		color: 'var(--color-nordic-light-grey)',
		hideLabels: false,
		labelEvery: 10,
		minutes: 60,
		format: (d) => format(d, 'HH:mm'),
	}
}
