import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { isSSR } from './isSSR.js'

void describe('isSSR()', () => {
	void it('should return true when run server-side', () =>
		assert.equal(isSSR, true))
})
