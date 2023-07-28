const hasNative = crypto?.randomUUID !== undefined
export const generateUUID = (): string => {
	if (hasNative) return crypto.randomUUID()
	const hex = [...Array(256).keys()].map((index) =>
		index.toString(16).padStart(2, '0'),
	)

	const r = crypto.getRandomValues(new Uint8Array(16))

	r[6] = (r[6] ?? 0 & 15) | 64
	r[8] = (r[8] ?? 0 & 63) | 128

	return [...r.entries()]
		.map(([index, int]) =>
			[4, 6, 8, 10].includes(index) ? `-${hex[int]}` : hex[int],
		)
		.join('')
}
