export const ValueLoading = ({
	value,
	height,
	width,
	light,
}: {
	value?: unknown
	height?: number
	width?: number
	light?: true
}) => {
	if (value === undefined)
		return <LoadingIndicator width={width} height={height} light={light} />
	return <span>{value}</span>
}

export const LoadingIndicator = ({
	height,
	width,
	light,
}: {
	height?: number
	width?: number
	light?: true
}) => {
	return (
		<span
			class={light ? 'value-loading-light' : 'value-loading'}
			style={{
				height: height ?? 24,
				width: width ?? 'auto',
				display: 'inline-block',
				aspectRatio: '5/1',
			}}
		>
			<span class={'progress-animation'}></span>
		</span>
	)
}
