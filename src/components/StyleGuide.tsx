import { createElement } from 'preact'

export const StyleGuide = () => {
	return (
		<section>
			<h1>Style guide</h1>
			<p>
				Nordic Semiconductor's web platforms should follow the corporate style
				guide. Below are the individual components used on this website that
				have the style guide applied.
			</p>
			<h2>Colors</h2>
			<p>We use CSS variables to set the colors:</p>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
				{[
					'--color-nordic-blue',
					'--color-nordic-sky',
					'--color-nordic-blueslate',
					'--color-nordic-lake',
					'--color-nordic-grass',
					'--color-nordic-sun',
					'--color-nordic-fall',
					'--color-nordic-power',
					'--color-nordic-red',
					'--color-nordic-pink',
					'--color-nordic-light-grey',
					'--color-nordic-middle-grey',
					'--color-nordic-dark-grey',
				].map((variable) => (
					<div class="m-2 d-flex flex-column align-items-center">
						<div
							style={{
								width: '32px',
								height: '32px',
								backgroundColor: `var(${variable})`,
							}}
						></div>
						<code>{variable}</code>
					</div>
				))}
			</div>
			<h2>Fonts</h2>
			<p>We use webfonts and CSS to set the fonts:</p>
			<div class="list-group mb-4">
				{[
					{
						element: 'h1',
						content: 'The five boxing wizards jump quickly',
						family: 'GT Eesti Display',
						weight: 100,
						size: '30px',
						lineHeight: '27px',
					},
					{
						element: 'h2',
						content: 'Pack my red box with five dozen quality jugs',
						family: 'GT Eesti Display',
						weight: 400,
						size: '20px',
						lineHeight: '27px',
					},
					{
						element: 'h3',
						content: 'Quick fox jumps nightly above wizard',
						family: 'GT Eesti Display',
						weight: 400,
						size: '16px',
						lineHeight: '22px',
					},
					{
						element: 'code',
						content:
							'The wizard quicly jinxed the gnomes before they vaporizedd',
						family: 'Pragmata',
						weight: 400,
						size: '16px',
						lineHeight: '22px',
					},
				].map(({ element, content, family, weight, size, lineHeight }) => (
					<div class="list-group-item">
						<div class="mt-2 mb-4">
							{createElement(
								element,
								{},
								<>
									<code>&lt;{element}&gt;</code> {content}
								</>,
							)}
						</div>
						<dl
							style={{
								display: 'grid',
								gridTemplate: '1fr 1fr / 1fr 1fr 1fr 1fr',
								gridAutoFlow: 'column',
							}}
						>
							<dt>Family</dt>
							<dd>{family}</dd>
							<dt>Weight</dt>
							<dd>{weight}</dd>
							<dt>Size</dt>
							<dd>{size}</dd>
							<dt>Line height</dt>
							<dd>{lineHeight}</dd>
						</dl>
					</div>
				))}
			</div>
		</section>
	)
}
