import type { IncludedSIMType } from '#content/sims/types.js'
import { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { UpgradePath } from '@hello.nrfcloud.com/proto/hello'
import { Type, type Static } from '@sinclair/typebox'

const Link = Type.String({ pattern: 'https://.*' })
const SemVer = Type.RegExp(
	// See https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
	{
		title: 'SemVer',
		description:
			'A version number that follows the semantic versioning specification',
	},
)

export const Firmware = Type.Object({
	version: SemVer,
	link: Link,
	upgradePath: Type.Optional(UpgradePath),
	important: Type.Boolean({
		title: 'Important',
		description: 'If true this will be shown as an important update.',
	}),
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

export const LEDPatternType = Type.Object(
	{
		color: Type.Number({ minimum: 0, maximum: 0xffffff }),
		intervalMs: Type.Number({ minimum: 1 }),
		description: Type.String({ minLength: 1 }),
		success: Type.Optional(
			Type.Boolean({
				description:
					'If true, this is a success pattern and should be shown when the device is connected to the cloud.',
			}),
		),
	},
	{ title: 'LED Pattern', description: 'Defines an LED pattern' },
)

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
		ledPattern: Type.Optional(Type.Array(LEDPatternType)),
		map: Type.Optional(
			Type.Object(
				{
					model: Type.Enum(ModelID, {
						title: 'Model',
						description: 'The model for this device used by the map',
					}),
				},
				{
					title: 'map',
					description:
						'Information about how this device type can be shared on the map',
				},
			),
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

export type Model = Omit<ModelMarkdownType, 'includedSIMs'> & {
	includedSIMs: Array<IncludedSIMType>
	variant?: string
}

export const ModelDefinitions = Type.Union([ModelMarkdown, ModelVariantOf])
type ModelOrVariantType = Static<typeof ModelDefinitions>

export const isVariant = (
	model: ModelOrVariantType,
): model is { variantOf: string; slug: string } => 'variantOf' in model
