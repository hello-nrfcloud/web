export const isCode = (code?: string): boolean =>
	/^[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{1,}\.[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{8}$/i.test(
		code ?? '',
	)
