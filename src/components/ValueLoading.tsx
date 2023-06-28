import cx from 'classnames'
export const ValueLoading = ({
	value,
	height,
	width,
	light,
	class: c,
}: {
	value?: unknown
	height?: number
	width?: number
	light?: true
	class?: string
}) => {
	if (value === undefined)
		return (
			<LoadingIndicator width={width} height={height} light={light} class={c} />
		)
	return <span>{value}</span>
}

export const LoadingIndicator = ({
	height,
	width,
	light,
	class: c,
}: {
	height?: number
	width?: number
	light?: true
	class?: string
}) => {
	return (
		<span
			class={cx(c, {
				'value-loading-light': light,
				'value-loading': !light,
			})}
			style={{
				height: height ?? 24,
				width: width ?? 'auto',
				display: 'inline-block',
				aspectRatio: '5/1',
				maxWidth: '100%',
			}}
		>
			<span class={'progress-animation'}></span>
		</span>
	)
}
