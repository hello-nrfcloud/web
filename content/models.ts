import type { Configuration } from '#context/Device.js'
import type { Model, IncludedSIM } from '#context/Models.js'
import { loadMarkdownContent } from '../pages/loadMarkdownContent.js'
import { sims } from './sims.js'

export type ModelMarkdown = {
	name: string
	title: string
	tagline: string
	abstract: string
	html: string
	links: {
		learnMore: string
		documentation: string
	}
	firmware: {
		version: string
		link: string
	}
	mfw: {
		version: string
		link: string
	}
	video?: {
		youtube?: {
			id: string
			title: string
		}
	}
	// Do not show in the list of available models
	hidden?: true
	includedSIMs: Array<string>
	defaultConfiguration: Configuration
	configurationPresets: Array<
		{
			name: string
			dataUsagePerDayMB: number
		} & Pick<Configuration, 'updateIntervalSeconds'> &
			Partial<Configuration>
	>
	// Treat this device as a the model specified by the Alias
	variantOf?: string
}

const getSIM = async (vendor: string): Promise<IncludedSIM> => {
	const sim = (await sims)[vendor]
	if (sim === undefined) throw new Error(`Unknown SIM: ${vendor}!`)
	return {
		...sim,
		vendor,
	}
}

export const models = (async (): Promise<Record<string, Model>> => {
	const modelsList = await loadMarkdownContent<ModelMarkdown>('models')
	const result: Record<string, Model> = {}

	for (const model of modelsList) {
		if (model.variantOf === undefined) {
			result[model.slug] = {
				...model,
				name: model.slug,
				includedSIMs: await Promise.all((model.includedSIMs ?? []).map(getSIM)),
			}
			continue
		}
		const baseModel = modelsList.find(({ slug }) => slug === model.variantOf)
		if (baseModel === undefined)
			throw new Error(`Unknown base model ${model.variantOf}!`)

		result[model.slug] = {
			...baseModel,
			name: model.variantOf,
			variant: model.slug,
			includedSIMs: await Promise.all((model.includedSIMs ?? []).map(getSIM)),
		}
	}
	return result
})()
