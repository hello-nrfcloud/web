import { isSSR } from './isSSR.js'
import { describe, test as it } from 'node:test'
import assert from 'node:assert'

void describe('isSSR()', () => {
	void it('should return true when run server-side', () =>
		assert.equal(isSSR, true))
})
