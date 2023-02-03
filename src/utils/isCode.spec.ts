import { isCode } from './isCode'

describe('isCode()', () => {
	it('should validate a valid code', () =>
		expect(isCode('42.d3c4fb4d')).toEqual(true))
	it('should not validate an invalid code', () =>
		expect(isCode('foo')).toEqual(false))
})
