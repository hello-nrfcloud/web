import { DK, DKs } from '../DKs'

export const SelectedDK = ({
	clearSelection,
	selected,
}: {
	clearSelection: () => unknown
	selected: keyof typeof DKs
}) => {
	const { title } = DKs[selected] as DK
	return (
		<div class="text-bg-dark p-4">
			<h2>Your selection:</h2>
			<section class={'p-1 w-100 text-center'}>
				<img
					alt={`${title} (${selected})`}
					src={`/static/images/${selected}.webp`}
					class="img-fluid w-100"
				/>
				{title} <small>({selected})</small>
			</section>
			<aside class={'d-flex justify-content-end'}>
				<button class={'btn btn-secondary'} onClick={() => clearSelection?.()}>
					clear selection
				</button>
			</aside>
		</div>
	)
}
