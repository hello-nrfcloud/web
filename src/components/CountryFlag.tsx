import type { Reported } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import styled from 'styled-components'
import { mccmnc2country } from './mccmnc2country.js'

export const Flag = styled.img`
	width: 20px;
	margin-left: 0.5rem;
`

export const CountryFlag = ({ state }: { state: Static<typeof Reported> }) => {
	const mccmnc = state?.device?.networkInfo?.mccmnc
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
