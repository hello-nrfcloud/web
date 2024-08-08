import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
	decodeMapState,
	encodeMapState,
	type MapStateType,
} from '#map/encodeMapState.js'
import { TimeSpan } from '#api/api.js'
import { MapStyle } from '#map/encodeMapState.js'

void describe('encodeMapState()', () => {
	void it('should encode a map state', () => {
		const state: MapStateType = {
			center: {
				lat: 63.458455,
				lng: 10.915287,
			},
			zoom: 10,
			style: MapStyle.DARK,
			cluster: false,
			history: TimeSpan.lastDay,
		}
		assert.deepEqual(decodeMapState(encodeMapState(state)), state)
	})

	void it('should encode a map state without history', () => {
		const state: MapStateType = {
			center: {
				lat: 63.458455,
				lng: 10.915287,
			},
			zoom: 10,
			style: MapStyle.DARK,
			cluster: false,
		}
		assert.deepEqual(decodeMapState(encodeMapState(state)), state)
	})
})
