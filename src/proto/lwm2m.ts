import {
	LwM2MObjectID,
	type Geolocation_14201,
	type LwM2MObjectInstance,
	type BatteryAndPower_14202,
	type ConnectionInformation_14203,
	type DeviceInformation_14204,
	type Environment_14205,
	type SolarCharge_14210,
	type ButtonPress_14220,
	type ApplicationConfiguration_14301,
	timestampResources,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isObject } from 'lodash-es'

const isLwM2MObject =
	<O extends LwM2MObjectInstance>(ObjectID: LwM2MObjectID) =>
	(message: unknown): message is O =>
		isObject(message) && 'ObjectID' in message && message.ObjectID === ObjectID

export const isGeolocation = isLwM2MObject<Geolocation_14201>(
	LwM2MObjectID.Geolocation_14201,
)

export const isBatteryAndPower = isLwM2MObject<BatteryAndPower_14202>(
	LwM2MObjectID.BatteryAndPower_14202,
)
export const isConnectionInformation =
	isLwM2MObject<ConnectionInformation_14203>(
		LwM2MObjectID.ConnectionInformation_14203,
	)
export const isDeviceInformation = isLwM2MObject<DeviceInformation_14204>(
	LwM2MObjectID.DeviceInformation_14204,
)
export const isEnvironment = isLwM2MObject<Environment_14205>(
	LwM2MObjectID.Environment_14205,
)
export const isSolarCharge = isLwM2MObject<SolarCharge_14210>(
	LwM2MObjectID.SolarCharge_14210,
)
export const isButtonPress = isLwM2MObject<ButtonPress_14220>(
	LwM2MObjectID.ButtonPress_14220,
)
export const isConfig = isLwM2MObject<ApplicationConfiguration_14301>(
	LwM2MObjectID.ApplicationConfiguration_14301,
)
export type LwM2MObjects = Array<
	| GeoLocation
	| BatteryAndPower
	| ConnectionInformation
	| DeviceInformation
	| Environment
	| SolarCharge
	| ButtonPress
>

export const toGeoLocation = ({
	Resources: { 6: src, 0: lat, 1: lng, 3: acc, 99: ts },
}: Geolocation_14201): GeoLocation => ({
	src,
	lat,
	lng,
	acc,
	ts,
})

export type GeoLocation = {
	src: string
	lat: number
	lng: number
	acc?: number
	ts: number
}

export type WithTimestamp = { ts: number }
export type BatteryAndPower = WithTimestamp &
	Partial<{
		mA: number
		'%': number
	}>
export const toBatteryAndPower = (
	message: BatteryAndPower_14202,
): BatteryAndPower => ({
	mA: message['Resources'][2],
	'%': message['Resources'][0],
	ts: message['Resources'][99],
})

export type SolarCharge = WithTimestamp & {
	mA: number
	V?: number
}
export const toSolarCharge = (message: SolarCharge_14210): SolarCharge => ({
	mA: message['Resources'][0],
	V: message['Resources'][1],
	ts: message['Resources'][99],
})

export type Environment = WithTimestamp &
	Partial<{
		// airHumidityReading
		p: number
		// airPressureReading
		mbar: number
		// airQualityReading
		IAQ: number
		// airTemperatureReading
		c: number
	}>
export const toEnvironment = (message: Environment_14205): Environment => ({
	p: message['Resources'][1],
	mbar: message['Resources'][2],
	IAQ: message['Resources'][10],
	c: message['Resources'][0],
	ts: message['Resources'][99],
})

export type ButtonPress = WithTimestamp & {
	id: number
}
export const toButtonPress = (message: ButtonPress_14220): ButtonPress => ({
	id: message['Resources'][0],
	ts: message['Resources'][99],
})

export type DeviceInformation = WithTimestamp & {
	imei: string
	iccid?: string
	appVersion: string
	modemFirmware: string
}
export const toDeviceInformation = (
	message: DeviceInformation_14204,
): DeviceInformation => ({
	imei: message['Resources'][0],
	iccid: message['Resources'][1],
	appVersion: message['Resources'][3],
	modemFirmware: message['Resources'][2],
	ts: message['Resources'][99],
})

export type ConnectionInformation = WithTimestamp & {
	mccmnc?: number
	networkMode?: string
	currentBand?: number
	eest?: number
}
export const toConnectionInformation = (
	message: ConnectionInformation_14203,
): ConnectionInformation => ({
	mccmnc: message['Resources'][5],
	networkMode: message['Resources'][0],
	currentBand: message['Resources'][1],
	eest: message['Resources'][11],
	ts: message['Resources'][99],
})

export const byTimestamp = (
	i1: LwM2MObjectInstance,
	i2: LwM2MObjectInstance,
): number => {
	const ts1 = i1.Resources[timestampResources[i1.ObjectID] as number] as number
	const ts2 = i2.Resources[timestampResources[i2.ObjectID] as number] as number
	return ts2 - ts1
}
