import { onBeforeRender as indexOnBeforeRender } from './index.page.server'

export const prerender = (): string[] => ['/recognizing-fingerprint']

export const onBeforeRender = indexOnBeforeRender
