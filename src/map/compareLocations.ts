import type { Static } from '@sinclair/typebox'
import { type Location } from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'

type LocationLike = Record<string, unknown> &
	Pick<Static<typeof Location>, 'acc' | 'lat' | 'lng'>
export const compareLocations = (l1: LocationLike, l2: LocationLike): boolean =>
	l1.lat === l2.lat && l1.lng === l2.lng && l1.acc === l2.acc
