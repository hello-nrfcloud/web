import { getItem, removeItem, setItem } from './localStorage.js'

describe('localStorage', () => {
	it('should swallow calls when run server side', () => {
		expect(setItem('foo', 'bar')).toEqual(undefined)
		expect(getItem('foo')).toEqual(null)
		expect(removeItem('foo')).toEqual(undefined)
	})
})
