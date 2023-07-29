import { describe, test as it } from 'node:test'
import assert from 'node:assert'
import type { Static } from '@sinclair/typebox'
import {
	LocationSource,
	type Location,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { compareLocations } from './compareLocations.js'

const testLocation: Static<typeof Location> = {
	'@context':
		'https://github.com/hello-nrfcloud/proto/transformed/PCA20035%2Bsolar/location',
	lat: 63.41999531,
	lng: 10.42999506,
	acc: 2420,
	src: LocationSource.MCELL,
	ts: Date.now(),
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
