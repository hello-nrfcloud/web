import type { IncludedSIMType } from '#content/sims/types.js'

import './IncludedSIMInfo.css'

export const IncludedSIMInfo = ({ sim }: { sim: IncludedSIMType }) => {
	return (
		<div class="sim-info">
			<div
				class="content"
				dangerouslySetInnerHTML={{
					__html: sim.html,
				}}
			></div>
			<div class="logo">
				<img
					src={`/static/sim/${sim.slug}.svg`}
					alt={sim.companyName}
					class="logo"
				/>
			</div>
		</div>
	)
}

export const IncludedSIMs = ({
	includedSIMs,
}: {
	includedSIMs: Array<IncludedSIMType>
}) => {
	const hasSIM = (includedSIMs.length ?? 0) > 0
	if (hasSIM === false) return null
	return (
		<>
			{includedSIMs.map((sim) => (
				<IncludedSIMInfo sim={sim} />
			))}
		</>
	)
}
