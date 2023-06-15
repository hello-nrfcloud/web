import { onBeforeRender as indexOnBeforeRender } from './index.page.server'

export const prerender = (): string[] => ['/device']

export const onBeforeRender = indexOnBeforeRender
