import { parseModemFirmwareVersion } from './parseModemFirmwareVersion.js'

describe('parseModemFirmwareVersion', () => {
	it('should return the modem firmware version', () =>
		expect(parseModemFirmwareVersion('mfw_nrf9160_1.3.4')).toEqual('1.3.4'))
	it('should return null in case it cannot be detected', () =>
		expect(parseModemFirmwareVersion('foo')).toEqual(null))
})
