import styled from 'styled-components'
import { mccmnc2country } from './mccmnc2country.js'

export const Flag = styled.img`
	width: 20px;
	margin-left: 0.5rem;
`

export const CountryFlag = ({ mccmnc }: { mccmnc: number }) => {
	const country = mccmnc !== undefined ? mccmnc2country(mccmnc) : undefined
	if (country === undefined) return null
	return (
		<Flag
			alt={country.name}
			title={country.name}
			src={`/static/flags/${country.code.toLowerCase()}.svg`}
		/>
	)
}
