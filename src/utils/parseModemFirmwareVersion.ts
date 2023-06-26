const mfwRegExp = /^mfw_nrf[0-9]+_([1-9]+\.[0-9]+\.[0-9]+)/
export const parseModemFirmwareVersion = (mfw: string): string | null => {
	const matches = mfwRegExp.exec(mfw)
	if (matches === null) return null
	return matches[1] as string
}
