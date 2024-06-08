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
	type RGBLED_14240,
	type NRFCloudServiceInfo_14401,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isObject } from 'lodash-es'

const isLwM2MObject =
	<O extends LwM2MObjectInstance>(ObjectID: LwM2MObjectID) =>
	(data: unknown): data is O =>
		isObject(data) && 'ObjectID' in data && data.ObjectID === ObjectID

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
export const isLED = isLwM2MObject<RGBLED_14240>(LwM2MObjectID.RGBLED_14240)
export const isConfig = isLwM2MObject<ApplicationConfiguration_14301>(
	LwM2MObjectID.ApplicationConfiguration_14301,
)
export const isNRFCloudServiceInfo = isLwM2MObject<NRFCloudServiceInfo_14401>(
	LwM2MObjectID.NRFCloudServiceInfo_14401,
)

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
export const toSolarCharge = (instance: SolarCharge_14210): SolarCharge => ({
	mA: instance['Resources'][0],
	V: instance['Resources'][1],
	ts: instance['Resources'][99],
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
export const toEnvironment = (instance: Environment_14205): Environment => ({
	p: instance['Resources'][1],
	mbar: instance['Resources'][2],
	IAQ: instance['Resources'][10],
	c: instance['Resources'][0],
	ts: instance['Resources'][99],
})

export type ButtonPress = WithTimestamp & {
	id: number
}
export const toButtonPress = (
	instance: LwM2MObjectInstance<ButtonPress_14220>,
): ButtonPress => ({
	id: instance['ObjectInstanceID'] ?? 0,
	ts: instance['Resources'][99],
})

export type LED = WithTimestamp & {
	id: number
	r: number
	g: number
	b: number
}
export const toLED = (instance: LwM2MObjectInstance<RGBLED_14240>): LED => ({
	r: instance['Resources'][0],
	g: instance['Resources'][1],
	b: instance['Resources'][2],
	id: instance['ObjectInstanceID'] ?? 0,
	ts: instance['Resources'][99],
})

export type NRFCloudServiceInfo = WithTimestamp & {
	fwTypes?: Array<string>
}
export const toNRFCloudServiceInfo = (
	message: NRFCloudServiceInfo_14401,
): NRFCloudServiceInfo => ({
	fwTypes: message['Resources'][0],
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

export const byTimestamp = (
	i1: LwM2MObjectInstance,
	i2: LwM2MObjectInstance,
): number => {
	const ts1 = i1.Resources[
		timestampResources.get(i1.ObjectID) as number
	] as number
	const ts2 = i2.Resources[
		timestampResources.get(i2.ObjectID) as number
	] as number
	return ts2 - ts1
}
