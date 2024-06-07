import { Ago } from '#components/Ago.js'
import { useFOTA } from '#context/FOTA.js'

export const FOTAJobs = () => {
	const { jobs } = useFOTA()

	if (jobs.length === 0) return null

	return (
		<section class="mt-4">
			<h2>Firmware Update of the Air (FOTA)</h2>
			{jobs.map((job) => (
				<div class="mb-2">
					<h3>
						{job.id} <Ago date={new Date(job.lastUpdatedAt)} />
					</h3>
					<p>
						<code>{job.status}</code> {job.statusDetail ?? ''}
					</p>
				</div>
			))}
		</section>
	)
}
