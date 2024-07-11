export const isOff = ({
	r,
	g,
	b,
}: {
	r: number
	g: number
	b: number
}): boolean => r === 0 && g === 0 && b === 0
