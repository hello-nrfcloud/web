import { onBeforeRender as indexOnBeforeRender } from './index.page.server.js'

export const prerender = (): string[] => ['/share']

export const onBeforeRender = indexOnBeforeRender
