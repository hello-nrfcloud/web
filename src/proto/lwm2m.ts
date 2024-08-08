import type { ConfigurationType } from '#content/models/types.js'
import {
	instanceTs,
	LwM2MObjectID,
	type ApplicationConfiguration_14301,
	type BatteryAndPower_14202,
	type ButtonPress_14220,
	type ConnectionInformation_14203,
	type DeviceInformation_14204,
	type Environment_14205,
	type Geolocation_14201,
	type LwM2MObjectInstance,
	type NRFCloudServiceInfo_14401,
	type Reboot_14250,
	type RGBLED_14240,
	type SolarCharge_14210,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isNumber, isObject } from 'lodash-es'

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
	ts: timeToDate(ts),
})

export type GeoLocation = {
	src: string
	lat: number
	lng: number
	acc?: number
	ts: Date
}

export type WithTimestamp = {
	ts: Date
}
export type BatteryAndPower = WithTimestamp &
	Partial<{
		mA: number
		'%': number
	}>
export const toBatteryAndPower = (
	instance: BatteryAndPower_14202,
): BatteryAndPower => ({
	mA: instance['Resources'][2],
	'%': instance['Resources'][0],
	ts: timeToDate(instance['Resources'][99]),
})

export type SolarCharge = WithTimestamp & {
	mA: number
	V?: number
}
export const toSolarCharge = (instance: SolarCharge_14210): SolarCharge => ({
	mA: instance['Resources'][0],
	V: instance['Resources'][1],
	ts: timeToDate(instance['Resources'][99]),
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
	ts: timeToDate(instance['Resources'][99]),
})

export type ButtonPress = WithTimestamp & {
	id: number
}
export const toButtonPress = (
	instance: LwM2MObjectInstance<ButtonPress_14220>,
): ButtonPress => ({
	id: instance['ObjectInstanceID'] ?? 0,
	ts: timeToDate(instance['Resources'][99]),
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
	ts: timeToDate(instance['Resources'][99]),
})

export type NRFCloudServiceInfo = WithTimestamp & {
	fwTypes?: Array<string>
}
export const toNRFCloudServiceInfo = (
	instance: NRFCloudServiceInfo_14401,
): NRFCloudServiceInfo => ({
	fwTypes: instance['Resources'][0],
	ts: timeToDate(instance['Resources'][99]),
})

export type ConnectionInformation = WithTimestamp & {
	mccmnc?: number
	networkMode?: string
	currentBand?: number
	eest?: number
}
export const toConnectionInformation = (
	instance: ConnectionInformation_14203,
): ConnectionInformation => ({
	mccmnc: instance['Resources'][5],
	networkMode: instance['Resources'][0],
	currentBand: instance['Resources'][1],
	eest: instance['Resources'][11],
	ts: timeToDate(instance['Resources'][99]),
})

export type DeviceInformation = WithTimestamp & {
	imei: string
	iccid?: string
	appVersion: string
	modemFirmware: string
}
export const toDeviceInformation = (
	instance: DeviceInformation_14204,
): DeviceInformation => ({
	imei: instance['Resources'][0],
	iccid: instance['Resources'][1],
	appVersion: instance['Resources'][3],
	modemFirmware: instance['Resources'][2],
	ts: timeToDate(instance['Resources'][99]),
})

export const byTimestamp = (
	i1: LwM2MObjectInstance,
	i2: LwM2MObjectInstance,
): number => {
	const ts1 = instanceTs(i1)
	const ts2 = instanceTs(i2)
	return ts2 - ts1
}

export const isTime = (n: unknown): n is number =>
	isNumber(n) && n > 1700000000 && n < 2000000000

export const timeToDate = (
	/**
	 * Unix time in seconds
	 */
	time: number,
): Date => new Date(time * 1000)

export type Reboot = WithTimestamp & {
	reason?: number
}
export const toReboot = (instance: Reboot_14250): Reboot => ({
	reason: instance['Resources'][0],
	ts: timeToDate(instance['Resources'][99]),
})

export const toConfig = (
	instance: ApplicationConfiguration_14301,
): ConfigurationType & WithTimestamp => ({
	updateIntervalSeconds: instance['Resources'][0],
	gnssEnabled: instance['Resources'][1],
	ts: timeToDate(instance['Resources'][99]),
})
