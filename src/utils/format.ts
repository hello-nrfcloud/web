export const format = (
	locales?: Intl.LocalesArgument,
): {
	formatInt: (value: number) => string
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

	return {
		formatInt,
		formatFloat,
	}
}

const { formatFloat, formatInt } = format()

export { formatFloat, formatInt }
