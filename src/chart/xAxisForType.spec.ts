import { describe, test as it } from 'node:test'
import { xAxisForType } from './xAxisForType.js'
import { check, objectMatching } from 'tsmatchers'

void describe('xAxisForType()', () => {
	void it('should create the chart data for the hourly chart', () => {
		check(xAxisForType('lastHour')).is(
			objectMatching({
				color: 'var(--color-nordic-light-grey)',
				labelEvery: 10,
				minutes: 60,
				hideLabels: false,
			}),
		)
	})

	void it('should create the chart data for the daily chart', () => {
		check(xAxisForType('lastDay')).is(
			objectMatching({
				color: 'var(--color-nordic-light-grey)',
				labelEvery: 2 * 60,
				minutes: 24 * 60,
				hideLabels: false,
			}),
		)
	})

	void it('should create the chart data for the weekly chart', () => {
		check(xAxisForType('lastWeek')).is(
			objectMatching({
				color: 'var(--color-nordic-light-grey)',
				labelEvery: 24 * 60,
				minutes: 24 * 60 * 7,
				hideLabels: false,
			}),
		)
	})

	void it('should create the chart data for the monthly chart', () => {
		check(xAxisForType('lastMonth')).is(
			objectMatching({
				color: 'var(--color-nordic-light-grey)',
				labelEvery: 24 * 60 * 2,
				minutes: 24 * 60 * 31,
				hideLabels: false,
			}),
		)
	})
})
