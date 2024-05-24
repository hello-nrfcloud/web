import type { GeoLocation } from '#proto/lwm2m.js'

export const compareLocations = (l1: GeoLocation, l2: GeoLocation): boolean =>
	l1.lat === l2.lat && l1.lng === l2.lng && l1.acc === l2.acc
