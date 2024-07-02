import { mccmnc2country } from '#components/mccmnc2country.js'
import type { WithTestId } from '#utils/WithTestId.js'

export const CountryFlag = ({
	mccmnc,
	class: c,
	'data-testid': testId,
}: {
	mccmnc: number
	class?: string
} & WithTestId) => {
	const country = mccmnc !== undefined ? mccmnc2country(mccmnc) : undefined
	if (country === undefined) return null
	return (
		<img
			class={c}
			width={20}
			alt={country.name}
			title={country.name}
			src={`/static/flags/${country.code.toLowerCase()}.svg`}
			data-testid={testId}
		/>
	)
}
