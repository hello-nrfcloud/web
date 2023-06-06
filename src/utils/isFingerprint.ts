export const isFingerprint = (fingerprint?: string): boolean =>
	/^[A-F0-9]{1,}\.[ABCDEFGHIJKMNPQRSTUVWXYZ2-9]{6}$/i.test(fingerprint ?? '')
