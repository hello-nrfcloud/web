import { getItem, removeItem, setItem } from './localStorage.js'

describe('localStorage', () => {
	let warn: any
	beforeAll(() => {
		// silence console
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
	})
	afterAll(() => {
		warn.mockReset()
	})
	it('should swallow calls when run server side', () => {
		expect(setItem('foo', 'bar')).toEqual(undefined)
		expect(getItem('foo')).toEqual(null)
		expect(removeItem('foo')).toEqual(undefined)
	})
})
