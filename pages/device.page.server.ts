import { onBeforeRender as indexOnBeforeRender } from './index.page.server.js'

export const prerender = (): string[] => ['/device']

export const onBeforeRender = indexOnBeforeRender
