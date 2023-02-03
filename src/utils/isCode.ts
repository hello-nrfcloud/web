export const isCode = (code?: string): boolean =>
	/^[0-9]{2}\.[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{8}/i.test(code ?? '')
