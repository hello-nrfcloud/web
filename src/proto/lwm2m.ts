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
export type LwM2MObjects = Array<
	| GeoLocation
	| Battery
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
	ts: ts.getTime(),
})

export type GeoLocation = {
	src: string
	lat: number
	lng: number
	acc?: number
	ts: number
}

export type WithTimestamp = { ts: number }
export type Battery = WithTimestamp &
	Partial<{
		mA: number
		'%': number
	}>
export const toBattery = (message: BatteryAndPower_14202): Battery => ({
	mA: message['Resources'][2],
	'%': message['Resources'][0],
	ts: message['Resources'][99].getTime(),
})

export type SolarCharge = WithTimestamp & {
	mA: number
	V?: number
}
export const toSolarCharge = (message: SolarCharge_14210): SolarCharge => ({
	mA: message['Resources'][0],
	V: message['Resources'][1],
	ts: message['Resources'][99].getTime(),
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
export const toEnvironment = (message: Environment_14205): Environment => {
	const mbar = message['Resources'][2]
	return {
		p: message['Resources'][1],
		mbar: mbar !== undefined ? mbar / 100 : undefined,
		IAQ: message['Resources'][10],
		c: message['Resources'][0],
		ts: message['Resources'][99].getTime(),
	}
}

export type ButtonPress = WithTimestamp & {
	id: number
}
export const toButton = (message: ButtonPress_14220): ButtonPress => ({
	id: message['Resources'][0],
	ts: message['Resources'][99].getTime(),
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
	ts: message['Resources'][99].getTime(),
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
	ts: message['Resources'][99].getTime(),
})
