import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { parseModemFirmwareVersion } from './parseModemFirmwareVersion.js'

void describe('parseModemFirmwareVersion', () => {
	void it('should return the modem firmware version', () =>
		assert.equal(parseModemFirmwareVersion('mfw_nrf9160_1.3.4'), '1.3.4'))
	void it('should return undefined in case it cannot be detected', () =>
		assert.equal(parseModemFirmwareVersion('foo'), undefined))
})
