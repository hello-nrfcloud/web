import { MapApp } from './MapApp.js'

const stackName = process.env.MAP_STACK_NAME ?? 'hello-nrfcloud-map'

new MapApp(stackName)
