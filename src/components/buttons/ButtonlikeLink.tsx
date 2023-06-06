import {
	ButtonAngledEffect,
	ButtonVariant,
	buttonStyleClass,
	type ButtonStyleArgs,
} from '#components/buttons/Button.js'

import { type ComponentChild } from 'preact'
import { useRef, type HTMLAttributes } from 'preact/compat'

export const ButtonlikeLink = ({
	children,
	...rest
}: HTMLAttributes<HTMLAnchorElement> &
	ButtonStyleArgs & { children: ComponentChild }) => {
	const ref = useRef<HTMLAnchorElement>(null)
	return (
		<a {...rest} class={buttonStyleClass(rest)} ref={ref}>
			<ButtonAngledEffect parentRef={ref} />
			<span style={{ position: 'relative', zIndex: 99 }}>{children}</span>
		</a>
	)
}

export const PrimaryLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.primary} {...args} />
export const SecondaryLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.secondary} {...args} />
export const SuccessLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.success} {...args} />
export const DangerLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.danger} {...args} />
export const WarningLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.warning} {...args} />
export const InfoLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.info} {...args} />
export const LightLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.light} {...args} />
export const DarkLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.dark} {...args} />
export const LinkLink = (
	args: Omit<Parameters<typeof ButtonlikeLink>[0], 'variant'>,
) => <ButtonlikeLink variant={ButtonVariant.link} {...args} />
