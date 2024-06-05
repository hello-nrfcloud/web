import type { PropsWithChildren } from 'preact/compat'

export const Success = ({
	children,
	class: className,
}: PropsWithChildren<{ class?: string }>) => (
	<div class={`alert alert-success ${className ?? ''}`}>{children}</div>
)
