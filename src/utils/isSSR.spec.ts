import { isSSR } from './isSSR.js'

describe('isSSR()', () => {
	it('should return true when run server-side', () =>
		expect(isSSR).toEqual(true))
})
