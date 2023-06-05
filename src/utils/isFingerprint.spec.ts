import { isFingerprint } from './isFingerprint.js'

describe('isFingerprint()', () => {
	it('should validate a valid fingerprint', () =>
		expect(isFingerprint('42.d3c4fb')).toEqual(true))
	it.each(['foo', '42.d3c4fbXX'])(
		'should not validate invalid fingerprint %s',
		(invalidFingerprint) =>
			expect(isFingerprint(invalidFingerprint)).toEqual(false),
	)
})
