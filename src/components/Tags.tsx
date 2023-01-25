import { TagName } from '../DKs'

const Tag = ({
	title,
	color,
	textColor,
}: {
	title: string
	color: string
	textColor?: string
}) => (
	<span
		class="badge rounded-pill"
		style={{
			backgroundColor: color,
			color: textColor ?? 'white',
			whiteSpace: 'no-wrap',
			height: '28px',
			lineHeight: '20px',
			fontSize: '12px',
		}}
	>
		{title}
	</span>
)

export const CellularTag = ({ name }: { name?: string }) => (
	<Tag title={name ?? 'Cellular'} color={'var(--color-nRF9)'} />
)

export const WiFiTag = ({ name }: { name?: string }) => (
	<Tag
		title={name ?? 'Wi-Fi'}
		color={'var(--color-nRF7)'}
		textColor="#ffffff"
	/>
)

export const ProductTag = ({
	name,
	family,
}: {
	name: string
	family: 'nRF9' | 'nRF7'
}) => {
	if (family === 'nRF7') return <WiFiTag name={name} />
	return <CellularTag name={name} />
}

export const toTag = (name: string): JSX.Element => {
	switch (name) {
		case TagName.wifi:
			return <WiFiTag />
		case TagName.cellular:
			return <CellularTag />
		case TagName.nRF9160DK:
			return <ProductTag name={'nRF9160 DK'} family="nRF9" />
		case TagName.nRF7002DK:
			return <ProductTag name={'nRF7002 DK'} family="nRF7" />
		case TagName.Thingy91:
			return <ProductTag name={'Thingy:91'} family="nRF9" />
		default:
			return <Tag title={name} color={'grey'} textColor={'white'} />
	}
}
