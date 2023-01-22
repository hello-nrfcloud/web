import { locationSourceColors, productFamilyColors } from '@components/colors'
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
		style={{ backgroundColor: color, color: textColor ?? 'white' }}
	>
		{title}
	</span>
)

export const CellularTag = ({ name }: { name?: string }) => (
	<Tag title={name ?? 'Cellular'} color={productFamilyColors.nRF9} />
)

export const WiFiTag = ({ name }: { name?: string }) => (
	<Tag
		title={name ?? 'Wi-Fi'}
		color={locationSourceColors.WIFI}
		textColor="#000000"
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
		case TagName.PCA10090:
			return <ProductTag name={'nRF9160 DK'} family="nRF9" />
		case TagName.PCA10143:
			return <ProductTag name={'nRF7002 PDK'} family="nRF7" />
		default:
			return <Tag title={name} color={'grey'} textColor={'black'} />
	}
}
