import { Type, type Static } from '@sinclair/typebox'
import type { IncludedSIMType } from '#content/sims/types.js'

const Link = Type.String({ pattern: 'https://.*' })

export const Firmware = Type.Object({
	version: Type.String({ minLength: 1 }),
	link: Link,
	bundleId: Type.Optional(Type.String({ minLength: 1 })), // e.g. 'APP*1e29dfa3*v2.0.0'
})

export const updateIntervalSeconds = Type.Number({
	minimum: 1,
	title: 'Update interval in seconds',
})
const gnssEnabled = Type.Boolean({
	description:
		'If enabled, the device will use GNSS to determine its location.',
})
export const Configuration = Type.Object({
	updateIntervalSeconds,
	gnssEnabled,
})

export type ConfigurationType = Static<typeof Configuration>

const slug = Type.String({
	minLength: 1,
	name: 'Slug',
	description: 'The model slug',
	examples: ['PCA20065'],
})

export const ModelMarkdown = Type.Object(
	{
		slug,
		title: Type.String({ minLength: 1 }),
		tagline: Type.String({ minLength: 1 }),
		abstract: Type.String({ minLength: 1 }),
		html: Type.String({ minLength: 1 }),
		links: Type.Object({
			learnMore: Link,
			documentation: Link,
		}),
		firmware: Firmware,
		mfw: Firmware,
		video: Type.Optional(
			Type.Object({
				youtube: Type.Object({
					id: Type.String({ minLength: 1 }),
					title: Type.String({ minLength: 1 }),
				}),
			}),
		),
		hidden: Type.Optional(
			Type.Boolean({
				description: 'If enabled, do not show in the list of available models.',
			}),
		),
		includedSIMs: Type.Array(Type.String({ minLength: 1 }), {
			uniqueItems: true,
			description: 'The slugs of the SIMs included with the model',
		}),
		defaultConfiguration: Configuration,
		configurationPresets: Type.Array(
			Type.Object({
				name: Type.String({ minLength: 1 }),
				dataUsagePerDayMB: Type.Number({ minimum: 1 / 1000 }),
				updateIntervalSeconds,
				gnssEnabled: Type.Optional(gnssEnabled),
			}),
		),
	},
	{ title: 'Model', description: 'Defines a model.' },
)

export const ModelVariantOf = Type.Object(
	{
		slug,
		variantOf: Type.String({
			minLength: 1,
			title: 'Variant of',
			description: 'Treat this device as a the model specified by the Alias',
		}),
	},
	{ title: 'Variant', description: 'A variant of another model.' },
)

type ModelMarkdownType = Static<typeof ModelMarkdown>

export const UnsupportedModel = Type.Object({
	title: Type.String({ minLength: 1 }),
	hidden: Type.Boolean({ const: true }),
	slug: Type.Literal('unsupported'),
})
export type UnsupportedModelType = Static<typeof UnsupportedModel>

export type Model = Omit<ModelMarkdownType, 'includedSIMs'> & {
	includedSIMs: Array<IncludedSIMType>
	variant?: string
}

export const ModelDefinitions = Type.Union([
	ModelMarkdown,
	ModelVariantOf,
	UnsupportedModel,
])
type ModelOrVariantType = Static<typeof ModelDefinitions>

export const isVariant = (
	model: ModelOrVariantType,
): model is { variantOf: string; slug: string } => 'variantOf' in model

export const isUnsupported = (model: {
	slug: string
}): model is UnsupportedModelType => model.slug === 'unsupported'
