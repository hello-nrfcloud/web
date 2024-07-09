import assert from 'node:assert/strict'
import { it, describe } from 'node:test'
import { encloseWithSlash } from './encloseWithSlash.js'

void describe('encloseWithSlash() should enclose a string with a slash', () => {
	for (const [input, expected] of [
		['/map/', '/map/'],
		['/map', '/map/'],
		['map/', '/map/'],
		['map', '/map/'],
		['', '/'],
	] as Array<[string, string]>) {
		void it(`${input} => ${expected}`, () =>
			assert.equal(encloseWithSlash(input), expected))
	}
})
