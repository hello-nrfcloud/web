import { Ago } from '#components/Ago.js'
import { Problem } from '#components/Problem.js'
import { useFOTA } from '#context/FOTA.js'
import type { FetchProblem } from '#utils/validatingFetch.js'
import { type FOTAJob, FOTAJobStatus } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { useState } from 'preact/hooks'

export const FOTAJobs = () => {
	const { jobs } = useFOTA()

	if (jobs.length === 0) return null

	return (
		<>
			<h3>Scheduled FOTAs</h3>
			<div class="mb-2">
				{jobs.map((job) => (
					<div class="mb-1">
						<p>
							<Ago date={new Date(job.timestamp)} key={job.timestamp} />{' '}
							<abbr title={`Job ${job.id}`}>
								(<code>{job.id.split('-')[0]}</code>)
							</abbr>{' '}
							<code>{job.status}</code>: {job.statusDetail ?? ''}
						</p>
						{[FOTAJobStatus.NEW, FOTAJobStatus.IN_PROGRESS].includes(
							job.status,
						) && <CancelJob job={job} />}
						<hr />
					</div>
				))}
			</div>
		</>
	)
}

const CancelJob = ({ job }: { job: Static<typeof FOTAJob> }) => {
	const [checked, setChecked] = useState(false)
	const [sending, setSending] = useState(false)
	const [problem, setProblem] = useState<FetchProblem>()
	const { cancelJob } = useFOTA()

	return (
		<>
			<form>
				<label>
					<input
						type="checkbox"
						class="me-1"
						checked={checked}
						onChange={() => setChecked((e) => !e)}
					/>
					<span>
						Check this box if you are sure you want to cancel this job.
					</span>
				</label>
				<button
					type="button"
					class="btn btn-outline-danger"
					disabled={!checked && !sending}
					onClick={() => {
						cancelJob(job)
							.start(() => {
								setSending(true)
								setProblem(undefined)
							})
							.done(() => {
								setSending(false)
							})
							.problem(setProblem)
					}}
				>
					cancel job
				</button>
			</form>
			{problem && <Problem class="mt-2" problem={problem} />}
		</>
	)
}
