import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { ModelMarkdown, UnsupportedModel } from './types.js'
import path from 'node:path'
import { loadMarkdownContentFromFile } from '../../pages/loadMarkdownContent.js'
import { readdirSync } from 'node:fs'

void describe('Model definitions', () => {
	void describe('unsupported model', () => {
		void it('should be valid', async () => {
			const maybeValue = validateWithTypeBox(UnsupportedModel)(
				await loadMarkdownContentFromFile(
					path.join(import.meta.dirname, 'unsupported.md'),
				),
			)
			if ('errors' in maybeValue) console.error(maybeValue.errors)
			assert.equal('errors' in maybeValue, false)
		})
	})

	for (const file of readdirSync(import.meta.dirname)
		.filter((f) => f.endsWith('.md'))
		.filter((f) => !f.includes('unsupported'))) {
		void describe(file, () => {
			void it('should be valid', async () => {
				const maybeValue = validateWithTypeBox(ModelMarkdown)(
					await loadMarkdownContentFromFile(
						path.join(import.meta.dirname, file),
					),
				)
				if ('errors' in maybeValue) console.error(maybeValue.errors)
				assert.equal('errors' in maybeValue, false)
			})
		})
	}
})
