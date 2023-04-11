import type { DK } from '@context/Device'
import { useResources, type Resource } from '@context/Resources'
import { Resources } from './Resources'

export const LeveledResources = ({ dk: type }: { dk?: DK }) => {
	const { resources } = useResources()

	const bySelectedType = (resource: Resource): boolean => {
		if (type === undefined) return true
		return resource.tags.find((tag) => type.tags.includes(tag)) !== undefined
	}

	const byTag =
		(tag: string) =>
		(resource: Resource): boolean =>
			resource.tags.includes(tag)
	return (
		<>
			<section
				style={{
					backgroundColor: 'var(--color-nordic-grass)',
				}}
				class="pt-4 pb-4"
			>
				<div class="container pt-4 pb-4">
					<header class="mb-4">
						<h2>Here is what's next</h2>
						<p>
							We've selected these 100-level introduction resources if this is
							the first time using a Nordic Semiconductor Development Kit:
						</p>
					</header>
					<Resources
						resources={resources
							.filter(bySelectedType)
							.filter(byTag('level:100'))}
					/>
				</div>
			</section>
			<section
				style={{
					backgroundColor: 'var(--color-nordic-lake)',
				}}
				class="pt-4 pb-4"
			>
				<div class="container pt-4 pb-4">
					<header class="text-light">
						<h2>200 level intermediate resources</h2>
						<p>
							Complete these advanced topics to get the most out of Nordic
							Semiconductor's Development Kits:
						</p>
					</header>
					<Resources
						resources={resources
							.filter(bySelectedType)
							.filter(byTag('level:200'))}
					/>
				</div>
			</section>
			<section
				style={{
					backgroundColor: 'var(--color-nordic-blueslate)',
				}}
				class="pt-4 pb-4"
			>
				<div class="container pt-4 pb-4">
					<header class="text-light">
						<h2>300 level advanced resources</h2>
						<p>
							Building a successful, world-class IoT product requires you to
							tackle these advanced topics:
						</p>
					</header>
					<Resources
						resources={resources
							.filter(bySelectedType)
							.filter(byTag('level:300'))}
					/>
				</div>
			</section>
		</>
	)
}
