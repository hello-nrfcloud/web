import { onBeforeRender as indexOnBeforeRender } from './index.page.server'

export const prerender = (): string[] => ['/share']

export const onBeforeRender = indexOnBeforeRender
