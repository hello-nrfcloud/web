import { isOutdated } from './isOutdated.js'

describe('isOutdated', () => {
	it('should not mark 1.1.2-sol-lp-mmflt as outdated for 1.1.1', () =>
		expect(isOutdated('1.1.1', '1.1.2-sol-lp-mmflt')).toEqual(false))
	it('should not mark 1.1.2-sol-lp-mmflt as outdated for 1.1.2', () =>
		expect(isOutdated('1.1.2', '1.1.2-sol-lp-mmflt')).toEqual(false))
	it('should mark 1.1.2-sol-lp-mmflt as outdated for 1.1.3', () =>
		expect(isOutdated('1.1.3', '1.1.2-sol-lp-mmflt')).toEqual(true))
	it.each([undefined, null, 'foo'])(
		'should mark the invalid version %j as outdated',
		(invalid) => expect(isOutdated('1.0.0', invalid as any)).toEqual(true),
	)
})
