import type { GeoLocation } from '#proto/lwm2m.js'
import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { compareLocations } from './compareLocations.js'
import { LocationSource } from './LocationSourceLabels.js'

const testLocation: GeoLocation = {
	lat: 63.41999531,
	lng: 10.42999506,
	acc: 2420,
	src: LocationSource.MCELL,
	ts: new Date(),
}

void describe('compareLocations()', () => {
	void it('should mark two equal locations as equal', () =>
		assert.equal(
			compareLocations(testLocation, {
				...testLocation,
				src: LocationSource.SCELL,
			}),
			true,
		))
	void it('should mark two unequal locations as unequal', () =>
		assert.equal(
			compareLocations(testLocation, {
				...testLocation,
				lat: 63.41999532,
				src: LocationSource.SCELL,
			}),
			false,
		))
})
