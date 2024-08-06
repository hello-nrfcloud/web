import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { encodeMapState } from './encodeMapState.js'
import maplibregl from 'maplibre-gl'
import { MapStyle } from '#context/Map.js'

void describe('encodeMapState()', () => {
	void it('should encode a map state', () =>
		assert.deepEqual(
			encodeMapState(
				{
					getCenter: () =>
						maplibregl.LngLat.convert([10.915287434991058, 63.45845568614055]),
					getZoom: () => 10.776208705876128,
				},
				MapStyle.DARK,
			),
			'map:63.45845568614055,10.915287434991058,10.776208705876128,dark',
		))
})
