import { ConfigureDevice } from '@hello.nrfcloud.com/proto/hello'
import {
	BatteryResponse,
	CommonRequest,
	GainResponse,
	LocationResponse,
	LocationTrailResponse,
} from '@hello.nrfcloud.com/proto/hello/history'
import { Thingy91WithSolarShieldMessage } from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { Type, type Static } from '@sinclair/typebox'

export const IncomingMessage = Type.Union([
	Thingy91WithSolarShieldMessage,
	BatteryResponse,
	GainResponse,
	LocationResponse,
	LocationTrailResponse,
])

export type IncomingMessageType = Static<typeof IncomingMessage>

export type OutgoingMessageType =
	| Static<typeof CommonRequest>
	| Static<typeof ConfigureDevice>
