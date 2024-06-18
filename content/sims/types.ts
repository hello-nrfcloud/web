import { Type, type Static } from '@sinclair/typebox'

export const IncludedSIM = Type.Object(
	{
		slug: Type.String({
			minLength: 1,
			name: 'Slug',
			description: 'The vendor slug',
			examples: ['onomondo'],
		}),
		companyName: Type.String({
			minLength: 1,
			name: 'Vendor company name',
			examples: ['Onomondo'],
		}),
		freeMb: Type.Number({
			minimum: 0,
			description: 'amount of free data on the shipped SIM in megabytes',
		}),
		html: Type.String({ minLength: 1 }),
	},
	{
		name: 'IncludedSIM',
		description: 'A SIM card included with a model',
	},
)

export type IncludedSIMType = Static<typeof IncludedSIM>
