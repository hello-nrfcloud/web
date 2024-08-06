import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { decodeMapState } from './encodeMapState.js'

void describe('decodeMapState()', () => {
	void it('should decode a map state', () =>
		assert.deepEqual(
			decodeMapState(
				'map:63.45845568614055,10.915287434991058,10.776208705876128',
			),
			{
				lat: 63.45845568614055,
				lng: 10.915287434991058,
				zoom: 10.776208705876128,
			},
		))
	void it('should return undefined if no map state is encoded', () =>
		assert.deepEqual(decodeMapState('map:foo'), undefined))
})
