import { validatingFetch } from '#utils/validatingFetch.js'
import { Type, type Static } from '@sinclair/typebox'

export const SIMDetails = Type.Object(
	{
		totalBytes: Type.Integer({
			minimum: 0,
			title: 'Total bytes',
			description: 'The amount of data available for usage in bytes',
			examples: [10000000, 4000000],
		}),
		usedBytes: Type.Integer({
			minimum: 0,
			title: 'Used bytes',
			description: 'The amount of data used in bytes',
			examples: [0, 2000],
		}),
		timestamp: Type.String({
			minLength: 1,
			title: 'Timestamp',
			description: 'The time when the usage data was last updated',
			examples: ['2024-07-01T12:11:43.066Z'],
		}),
	},
	{
		title: 'SIM Details',
		description:
			'Describes the data usage details of a SIM. See https://github.com/bifravst/sim-details?tab=readme-ov-file#usage',
	},
)

export type SIMDetailsType = Static<typeof SIMDetails>

export const getSIMDetails = (simDetailsAPIURL: URL) => (iccid: string) =>
	validatingFetch(SIMDetails)(new URL(`./sim/${iccid}`, simDetailsAPIURL))
