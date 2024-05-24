import { mccmnc2country } from '#components/mccmnc2country.js'

export const CountryFlag = ({
	mccmnc,
	class: c,
}: {
	mccmnc: number
	class?: string
}) => {
	const country = mccmnc !== undefined ? mccmnc2country(mccmnc) : undefined
	if (country === undefined) return null
	return (
		<img
			class={c}
			width={20}
			alt={country.name}
			title={country.name}
			src={`/static/flags/${country.code.toLowerCase()}.svg`}
		/>
	)
}
