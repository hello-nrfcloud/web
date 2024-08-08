export const format = (
	locales?: Intl.LocalesArgument,
): {
	formatInt: (value: number) => string
	formatDistance: (value: number) => string
	formatFloat: (value: number, maximumFractionDigits?: number) => string
} => {
	const intFormatter = new Intl.NumberFormat(locales, {
		maximumFractionDigits: 0,
	})
	const formatInt = (value: number) => intFormatter.format(value)

	const formatters = new Map<number, Intl.NumberFormat>([
		[
			1,
			new Intl.NumberFormat(locales, {
				maximumFractionDigits: 1,
			}),
		],
	])

	const formatFloat = (value: number, maximumFractionDigits = 1) => {
		if (!formatters.has(maximumFractionDigits)) {
			const f = new Intl.NumberFormat(undefined, {
				maximumFractionDigits,
			})
			formatters.set(maximumFractionDigits, f)
		}
		return formatters.get(maximumFractionDigits)!.format(value)
	}

	const formatDistance = (distance: number): string => {
		if (distance === 1) {
			return '1 second'
		} else if (distance < 60) {
			return `${formatInt(distance)} seconds`
		} else if (distance === 60) {
			return '1 minute'
		} else if (distance < 3600) {
			return `${formatInt(Math.floor(distance / 60))} minutes`
		} else if (distance === 3600) {
			return '1 hour'
		} else {
			return `${formatInt(Math.floor(distance / 3600))} hours`
		}
	}

	return {
		formatInt,
		formatFloat,
		formatDistance,
	}
}

const { formatFloat, formatInt, formatDistance } = format()

export { formatDistance, formatFloat, formatInt }
