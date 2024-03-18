import { onBeforeRender as indexOnBeforeRender } from './index.page.server.js'

export const prerender = (): string[] => ['/recognizing-fingerprint']

export const onBeforeRender = indexOnBeforeRender
