import { loadSIMsfromMarkdown } from '#content/sims/loadSIMsfromMarkdown.js'
import type { IncludedSIMType } from '#content/sims/types.js'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Type } from '@sinclair/typebox'
import { loadMarkdownContent } from '../../pages/loadMarkdownContent.js'
import {
	ModelDefinitions,
	isUnsupported,
	isVariant,
	type Model,
	type UnsupportedModelType,
} from './types.js'

export const getSIM = async (vendor: string): Promise<IncludedSIMType> => {
	const sim = (await loadSIMsfromMarkdown)[vendor]
	if (sim === undefined) throw new Error(`Unknown SIM: ${vendor}!`)
	return sim
}

const v = validateWithTypeBox(Type.Array(ModelDefinitions, { minItems: 1 }))

export const loadModelsFromMarkdown = (async (): Promise<
	Record<string, Model | UnsupportedModelType>
> => {
	const maybeModelsList = v(await loadMarkdownContent('models'))
	if ('errors' in maybeModelsList) {
		console.error(maybeModelsList.errors)
		throw new Error(`Invalid models definition!`)
	}
	const result: Record<string, Model | UnsupportedModelType> = {}

	const modelsList = maybeModelsList.value

	for (const model of modelsList) {
		if (isUnsupported(model)) {
			result[model.slug] = model
			continue
		}
		if (!isVariant(model)) {
			result[model.slug] = {
				...model,
				includedSIMs: await Promise.all((model.includedSIMs ?? []).map(getSIM)),
			}
			continue
		}
		const baseModel = modelsList.find(({ slug }) => slug === model.variantOf)
		if (baseModel === undefined)
			throw new Error(`Unknown base model ${model.variantOf}!`)
		if (isVariant(baseModel))
			throw new Error(`Base model ${model.slug} is a variant!`)
		if (isUnsupported(baseModel))
			throw new Error(`Base model ${model.slug} is unsupported!`)

		result[model.slug] = {
			...baseModel,
			slug: model.variantOf,
			variant: model.slug,
			includedSIMs: await Promise.all(baseModel.includedSIMs.map(getSIM)),
		}
	}
	return result
})()
