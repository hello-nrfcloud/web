import { TimeSpan } from '#api/api.js'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Type, type Static } from '@sinclair/typebox'

export enum MapStyle {
	DARK = 'dark',
	LIGHT = 'light',
}

export const MapState = Type.Object({
	center: Type.Optional(
		Type.Object({
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
	),
	zoom: Type.Optional(Type.Number({ minimum: 0, maximum: 24, title: 'Zoom' })),
	style: Type.Optional(Type.Enum(MapStyle)),
	cluster: Type.Optional(Type.Boolean()),
	history: Type.Optional(Type.Enum(TimeSpan)),
})
export type MapStateType = Static<typeof MapState>

const sep = ':'
const stateSep = '!'
const valueSep = ','
const recordSep = ';'
const mapStatePrefix = 'map' + sep

enum MapStateKey {
	center = 'c',
	zoom = 'z',
	style = 's',
	cluster = 'k',
	history = 'h',
}

const encodeRecord = (key: string, ...values: (string | number)[]): string =>
	`${key}${sep}${values.join(valueSep)}`

export const encodeMapState = ({
	center,
	zoom,
	style,
	cluster,
	history,
}: MapStateType): string => {
	const records = []
	if (center !== undefined) {
		records.push(
			encodeRecord(
				MapStateKey.center,
				...[center.lat, center.lng].map((n) => n.toFixed(6)),
			),
		)
	}
	if (zoom !== undefined) {
		records.push(encodeRecord(MapStateKey.zoom, Math.floor(zoom)))
	}
	if (style !== undefined) {
		records.push(encodeRecord(MapStateKey.style, style))
	}
	if (cluster !== undefined) {
		records.push(
			encodeRecord(MapStateKey.cluster, cluster ? 'cluster' : 'trail'),
		)
	}
	if (history !== undefined) {
		records.push(encodeRecord(MapStateKey.history, history))
	}
	return `${mapStatePrefix}${records.join(recordSep)}`
}

const validate = validateWithTypeBox(MapState)

export const decodeMapState = (hash: string): MapStateType | undefined => {
	const encodedMapState = hash
		.split(stateSep)
		.find((s) => s.startsWith(mapStatePrefix))
	if (encodedMapState === undefined) return undefined
	const decodedState = encodedMapState
		.slice(mapStatePrefix.length)
		.split(recordSep)
		.map((r) => {
			const [key, values] = r.split(sep, 2)
			if (values === undefined) return { key, values: [] }
			return { key, values: values.split(valueSep) }
		})
		.reduce<MapStateType>((acc, { key, values }) => {
			if (key === MapStateKey.center) {
				acc.center = { lat: Number(values[0]), lng: Number(values[1]) }
			}
			if (key === MapStateKey.zoom) {
				acc.zoom = Number(values[0])
			}
			if (key === MapStateKey.style) {
				acc.style = values[0] as MapStyle
			}
			if (key === MapStateKey.cluster) {
				acc.cluster = values[0] === 'cluster'
			}
			if (key === MapStateKey.history) {
				acc.history = values[0] as TimeSpan
			}
			return acc
		}, {})
	const maybeValidState = validate(decodedState)
	if ('errors' in maybeValidState) return undefined
	return maybeValidState.value
}
