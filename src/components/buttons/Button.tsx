import cx from 'classnames'
import { type ComponentChild } from 'preact'
import {
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type PropsWithChildren,
	type RefObject,
} from 'preact/compat'
import './Button.css'

export enum ButtonVariant {
	primary = 'primary',
	secondary = 'secondary',
	success = 'success',
	danger = 'danger',
	warning = 'warning',
	info = 'info',
	light = 'light',
	dark = 'dark',
	link = 'link',
}

export const ButtonAngledEffect = ({
	parentRef,
}: {
	parentRef: RefObject<HTMLElement>
}) => {
	const [size, setSize] = useState<DOMRect>()

	useEffect(() => {
		if (parentRef.current === null) return
		setSize(parentRef.current.getBoundingClientRect())
	}, [parentRef])

	const height = 200
	const width = height * Math.tan(Math.PI / 3)

	if (size === undefined) return null
	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				position: 'absolute',
				top: 0,
				right: -width + size.height * Math.tan(Math.PI / 3),
				zIndex: 1,
			}}
			class="triangle"
		>
			<polygon
				points={`0,0 ${width},0 ${width},${height}`}
				style="fill:#ffffff;fill-opacity:0.3;stroke:none;"
			/>
		</svg>
	)
}

export const buttonStyleClass = ({
	variant,
	outline,
	small,
	class: c,
}: {
	variant: ButtonVariant
	outline?: boolean
	small?: boolean
	class?: string
}) =>
	cx('btn nordic-button', c ?? '', {
		[`btn-outline-${variant}`]: outline ?? false,
		[`btn-${variant}`]: !(outline ?? false),
		'btn-sm': small ?? false,
	})

export type ButtonStyleArgs = {
	variant: ButtonVariant
	outline?: boolean
	small?: boolean
	class?: string
	// disable the angled effect
	noAngleEffect?: true
}
export const Button = ({
	children,
	noAngleEffect,
	...rest
}: HTMLAttributes<HTMLButtonElement> &
	ButtonStyleArgs & { children: ComponentChild }) => {
	const angleEffect = !(noAngleEffect ?? false) && !(rest.outline ?? false)
	const ref = useRef<HTMLButtonElement>(null)
	return (
		<button type="button" {...rest} class={buttonStyleClass(rest)} ref={ref}>
			{angleEffect && <ButtonAngledEffect parentRef={ref} />}
			<span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
		</button>
	)
}

export const Primary = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.primary} {...args} />
export const Secondary = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.secondary} {...args} noAngleEffect />
export const Success = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.success} {...args} />
export const Danger = (args: Omit<Parameters<typeof Button>[0], 'variant'>) => (
	<Button variant={ButtonVariant.danger} {...args} />
)
export const Warning = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.warning} {...args} />
export const Info = (args: Omit<Parameters<typeof Button>[0], 'variant'>) => (
	<Button variant={ButtonVariant.info} {...args} />
)
export const Light = (args: Omit<Parameters<typeof Button>[0], 'variant'>) => (
	<Button variant={ButtonVariant.light} {...args} />
)
export const Dark = (args: Omit<Parameters<typeof Button>[0], 'variant'>) => (
	<Button variant={ButtonVariant.dark} {...args} />
)
export const Link = (args: Omit<Parameters<typeof Button>[0], 'variant'>) => (
	<Button variant={ButtonVariant.link} {...args} />
)

export const Transparent = ({
	children,
	class: c,
	...rest
}: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>) => (
	<button
		type="button"
		class={c ?? ''}
		style={{
			border: 0,
			background: 'transparent',
			padding: 0,
			margin: 0,
			fontWeight: 'inherit',
		}}
		{...rest}
	>
		{children}
	</button>
)
