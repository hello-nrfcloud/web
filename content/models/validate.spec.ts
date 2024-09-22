import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { loadMarkdownContentFromFile } from '../../pages/loadMarkdownContent.js'
import { ModelMarkdown } from './types.js'

const v = validateWithTypeBox(ModelMarkdown)

void describe('Model definitions', () => {
	for (const file of readdirSync(import.meta.dirname).filter((f) =>
		f.endsWith('.md'),
	)) {
		void describe(file, () => {
			void it('should be valid', async () => {
				const modelInfo = await loadMarkdownContentFromFile(
					path.join(import.meta.dirname, file),
				)
				const maybeValue = v(modelInfo)
				if ('errors' in maybeValue) console.error(maybeValue.errors)
				assert.equal('errors' in maybeValue, false)
			})
		})
	}
})
