import { onBeforeRender as indexOnBeforeRender } from './index.page.server.js'

export const prerender = (): string[] => ['/device/map']

export const onBeforeRender = indexOnBeforeRender
