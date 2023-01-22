import { render } from 'preact'
import { Storybook } from './Storybook'

const root = document.getElementById('root')

if (root === null) {
	console.error(`Could not find root element!`)
} else {
	render(<Storybook />, root)
}
