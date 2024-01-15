import type { JSX } from 'preact/jsx-runtime'

export type LucideProps = {
	color?: string
	size?: string | number
	strokeWidth?: string | number
	absoluteStrokeWidth?: boolean
} & Partial<Omit<JSX.SVGAttributes, 'ref' | 'size'>>
