import cx from 'classnames'
import { createElement, type ComponentChild } from 'preact'
import { useEffect, useRef, useState, type HTMLAttributes } from 'preact/compat'

export const StyleGuide = () => {
	return (
		<section>
			<h1>Style guide</h1>
			<p>
				Nordic Semiconductor's web platforms should follow the corporate style
				guide. Below are the individual components used on this website that
				have the style guide applied.
			</p>
			<h2>Colors</h2>
			<p>We use CSS variables to set the colors:</p>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
				{[
					'--color-nordic-blue',
					'--color-nordic-sky',
					'--color-nordic-blueslate',
					'--color-nordic-lake',
					'--color-nordic-grass',
					'--color-nordic-sun',
					'--color-nordic-fall',
					'--color-nordic-power',
					'--color-nordic-red',
					'--color-nordic-pink',
					'--color-nordic-light-grey',
					'--color-nordic-middle-grey',
					'--color-nordic-dark-grey',
				].map((variable) => (
					<div class="m-2 d-flex flex-column align-items-center">
						<div
							style={{
								width: '32px',
								height: '32px',
								backgroundColor: `var(${variable})`,
							}}
						></div>
						<code>{variable}</code>
					</div>
				))}
			</div>
			<h2>Fonts</h2>
			<p>We use webfonts and CSS to set the fonts:</p>
			<div class="list-group mb-4">
				{[
					{
						element: 'h1',
						content: 'The five boxing wizards jump quickly',
						family: 'GT Eesti Display',
						weight: 100,
						size: '30px',
						lineHeight: '27px',
					},
					{
						element: 'h2',
						content: 'Pack my red box with five dozen quality jugs',
						family: 'GT Eesti Display',
						weight: 400,
						size: '20px',
						lineHeight: '27px',
					},
					{
						element: 'h3',
						content: 'Quick fox jumps nightly above wizard',
						family: 'GT Eesti Display',
						weight: 400,
						size: '16px',
						lineHeight: '22px',
					},
					{
						element: 'code',
						content:
							'The wizard quicly jinxed the gnomes before they vaporizedd',
						family: 'Pragmata',
						weight: 400,
						size: '16px',
						lineHeight: '22px',
					},
				].map(({ element, content, family, weight, size, lineHeight }) => (
					<div class="list-group-item">
						<div class="mt-2 mb-4">
							{createElement(
								element,
								{},
								<>
									<code>&lt;{element}&gt;</code> {content}
								</>,
							)}
						</div>
						<dl
							style={{
								display: 'grid',
								gridTemplate: '1fr 1fr / 1fr 1fr 1fr 1fr',
								gridAutoFlow: 'column',
							}}
						>
							<dt>Family</dt>
							<dd>{family}</dd>
							<dt>Weight</dt>
							<dd>{weight}</dd>
							<dt>Size</dt>
							<dd>{size}</dd>
							<dt>Line height</dt>
							<dd>{lineHeight}</dd>
						</dl>
					</div>
				))}
			</div>
			<h2>Buttons</h2>
			<div class="mb-4">
				<h3>Regular</h3>
				{buttonVariants.map((variant) => (
					<Button variant={variant} class={`me-1 mt-1`}>
						{variant.slice(0, 1).toUpperCase()}
						{variant.slice(1)} Button
					</Button>
				))}
				<h3 class="mt-3">Regular (disabled)</h3>
				{buttonVariants.map((variant) => (
					<Button variant={variant} class={`me-1 mt-1`} disabled>
						{variant.slice(0, 1).toUpperCase()}
						{variant.slice(1)}
					</Button>
				))}
				<h3 class="mt-3">Outline</h3>
				{buttonVariants.map((variant) => (
					<Button variant={variant} class={`me-1 mt-1`} outline>
						{variant.slice(0, 1).toUpperCase()}
						{variant.slice(1)}
					</Button>
				))}
				<h3 class="mt-3">Outline (disabled)</h3>
				{buttonVariants.map((variant) => (
					<Button variant={variant} class={`me-1 mt-1`} disabled>
						{variant.slice(0, 1).toUpperCase()}
						{variant.slice(1)}
					</Button>
				))}
			</div>
		</section>
	)
}

enum ButtonVariant {
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

const buttonVariants = [
	ButtonVariant.primary,
	ButtonVariant.secondary,
	ButtonVariant.success,
	ButtonVariant.danger,
	ButtonVariant.warning,
	ButtonVariant.info,
	ButtonVariant.light,
	ButtonVariant.dark,
	ButtonVariant.link,
]

const Button = (
	args: HTMLAttributes<HTMLButtonElement> & {
		variant: ButtonVariant
		outline?: true
		small?: true
		class?: string
	} & { children: ComponentChild },
) => {
	const ref = useRef<HTMLButtonElement>(null)
	const { children, variant, outline, small, class: c, ...rest } = args
	const [size, setSize] = useState<DOMRect>()

	useEffect(() => {
		if (ref.current === null) return
		setSize(ref.current.getBoundingClientRect())
	}, [ref])

	const height = 200
	const width = height * Math.tan(Math.PI / 3)

	return (
		<button
			type="button"
			{...rest}
			class={cx('btn nordic-button', c ?? '', {
				[`btn-outline-${variant}`]: outline ?? false,
				[`btn-${variant}`]: !(outline ?? false),
				'btn-sm': small ?? false,
			})}
			ref={ref}
		>
			{size && (
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
			)}
			<span style={{ position: 'relative', zIndex: 99 }}>{children}</span>
		</button>
	)
}

export const PrimaryButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.primary} {...args} />
export const SecondaryButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.secondary} {...args} />
export const SuccessButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.success} {...args} />
export const DangerButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.danger} {...args} />
export const WarningButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.warning} {...args} />
export const InfoButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.info} {...args} />
export const LightButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.light} {...args} />
export const DarkButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.dark} {...args} />
export const LinkButton = (
	args: Omit<Parameters<typeof Button>[0], 'variant'>,
) => <Button variant={ButtonVariant.link} {...args} />
