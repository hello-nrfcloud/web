import type { ComponentChild } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

export type Size = { width: number; height: number }

export const WithResize = ({
	children,
}: {
	children: (size?: Size) => ComponentChild
}) => {
	const ref = useRef<HTMLImageElement>(null)
	const [size, setSize] = useState<Size>()

	useEffect(() => {
		if (ref.current === null) return
		setSize(ref.current.getBoundingClientRect())
	}, [ref])

	useEffect(() => {
		if (ref.current === null) return
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if ('contentRect' in entry) {
					const contentRect = entry.contentRect
					setSize(contentRect)
				}
			}
		})
		resizeObserver.observe(ref.current)
		return () => {
			if (ref.current !== null) resizeObserver.unobserve(ref.current)
		}
	}, [ref])

	return <div ref={ref}>{children(size)}</div>
}
