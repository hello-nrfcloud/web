import { TimeSpan } from '#api/api.js'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Type, type Static } from '@sinclair/typebox'

export enum MapStyle {
	DARK = 'dark',
	LIGHT = 'light',
}

export const MapState = Type.Object({
	center: Type.Object({
		lat: Type.Number({
			minimum: -90,
			maximum: 90,
			title: 'Latitude',
			description:
				'The decimal notation of latitude in degrees, e.g. -43.5723 [World Geodetic System 1984].',
		}),
		lng: Type.Number({
			minimum: -180,
			maximum: 180,
			title: 'Longitude',
			description:
				'The decimal notation of longitude in degrees, e.g. 153.21760 [World Geodetic System 1984].',
		}),
	}),
	zoom: Type.Number({}),
	style: Type.Enum(MapStyle),
	cluster: Type.Boolean(),
	history: Type.Optional(Type.Enum(TimeSpan)),
})
export type MapStateType = Static<typeof MapState>

export const encodeMapState = ({
	center: { lat, lng },
	zoom,
	style,
	cluster,
	history,
}: MapStateType): string => {
	const parts = [lat, lng, zoom, style, cluster ? 'cluster' : 'trail']
	if (history !== undefined) parts.push(history)
	return `map:${parts.join(';')}`
}

const validate = validateWithTypeBox(MapState)

export const decodeMapState = (hash: string): MapStateType | undefined => {
	const [lat, lng, zoom, style, cluster, history] = hash.slice(4).split(';')
	const s: Record<string, any> = {
		center: { lat: Number(lat), lng: Number(lng) },
		zoom: Number(zoom),
		style,
		cluster: cluster === 'cluster',
	}
	if (history !== undefined) s.history = history as TimeSpan
	const maybeValidState = validate(s)
	if ('errors' in maybeValidState) return undefined
	return maybeValidState.value
}
