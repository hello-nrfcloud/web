import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { isOutdated } from './isOutdated.js'

void describe('isOutdated', () => {
	void it('should not mark 1.1.2-sol-lp-mmflt as outdated for 1.1.1', () =>
		assert.equal(isOutdated('1.1.1', '1.1.2-sol-lp-mmflt'), false))
	void it('should not mark 1.1.2-sol-lp-mmflt as outdated for 1.1.2', () =>
		assert.equal(isOutdated('1.1.2', '1.1.2-sol-lp-mmflt'), false))
	void it('should mark 1.1.2-sol-lp-mmflt as outdated for 1.1.3', () =>
		assert.equal(isOutdated('1.1.3', '1.1.2-sol-lp-mmflt'), true))

	for (const invalid of [undefined, null, 'foo']) {
		void it(`should mark the invalid version ${JSON.stringify(
			invalid,
		)} as outdated`, (invalid) =>
			assert.equal(isOutdated('1.0.0', invalid as any), true))
	}
})
