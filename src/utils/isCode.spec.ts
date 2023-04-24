import { isCode } from './isCode.js'

describe('isCode()', () => {
	it('should validate a valid code', () =>
		expect(isCode('42.d3c4fb4d')).toEqual(true))
	it.each(['foo', '42.d3c4fb4d8'])(
		'should not validate invalid code %s',
		(invalidCode) => expect(isCode(invalidCode)).toEqual(false),
	)
})
