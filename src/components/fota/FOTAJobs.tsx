import { Ago } from '#components/Ago.js'
import { useFOTA } from '#context/FOTA.js'

export const FOTAJobs = () => {
	const { jobs } = useFOTA()

	if (jobs.length === 0) return null

	return (
		<>
			<h3>Scheduled FOTAs</h3>
			<div class="mb-2">
				{jobs.map((job) => (
					<p class="mb-1">
						<Ago date={new Date(job.timestamp)} key={job.timestamp} />{' '}
						<abbr title={`Job ${job.id}`}>
							(<code>{job.id.split('-')[0]}</code>)
						</abbr>{' '}
						<code>{job.status}</code>: {job.statusDetail ?? ''}
					</p>
				))}
			</div>
		</>
	)
}
