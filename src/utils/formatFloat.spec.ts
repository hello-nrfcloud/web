import { formatFloat } from './formatFloat.js'

describe('formatFloat', () => {
	it('should nicely format floats', () =>
		expect(formatFloat(4.762067631165049)).toEqual('4.76'))

	it('should cut off trailing slash', () =>
		expect(formatFloat(4.0)).toEqual('4'))
})
