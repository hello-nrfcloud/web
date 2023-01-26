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
		class="badge rounded-pill ms-1"
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

export const Level100Tag = () => (
	<Tag
		color="var(--color-nordic-grass)"
		textColor="var(--color-nordic-darkgrey)"
		title="Lvl 100"
	/>
)

export const Level200Tag = () => (
	<Tag color="var(--color-nordic-lake)" textColor="white" title="Lvl 200" />
)

export const Level300Tag = () => (
	<Tag
		color="var(--color-nordic-blueslate)"
		textColor="white"
		title="Lvl 300"
	/>
)

export const toTag = (name: string): JSX.Element => {
	switch (name) {
		case `family:nRF7`:
			return <WiFiTag />
		case `family:nRF9`:
			return <CellularTag />
		case `model:PCA10090`:
			return <ProductTag name={'nRF9160 DK'} family="nRF9" />
		case `model:PCA10143`:
			return <ProductTag name={'nRF7002 DK'} family="nRF7" />
		case `model:PCA20035`:
			return <ProductTag name={'Thingy:91'} family="nRF9" />
		case 'level:100':
			return <Level100Tag />
		case 'level:200':
			return <Level200Tag />
		case 'level:300':
			return <Level300Tag />
		default:
			return <Tag title={name} color={'grey'} textColor={'white'} />
	}
}
