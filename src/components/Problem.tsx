import type { FetchProblem } from '#utils/validatingFetch.js'

export const Problem = ({
	problem: { problem, awsApiGwReqId, awsReqId },
	class: className,
}: {
	problem: FetchProblem
	class?: string
}) => (
	<div class={`alert alert-danger problem ${className}`}>
		<p class="mb-2">
			<strong>{problem.title}</strong>
			{problem.detail !== undefined && (
				<>
					<br />
					<small>{problem.detail}</small>
				</>
			)}
		</p>
		<p class="mb-2">
			If this problem persists, you can{' '}
			<a
				href="https://devzone.nordicsemi.com/f/nordic-q-a/tags/hello-nrfcloud"
				target="_blank"
			>
				search {'{'}DevZone for known issues
			</a>
			.
		</p>
		<p class="mb-2">
			When{' '}
			<a href="https://devzone.nordicsemi.com/support/add" target="_blank">
				creating a new {'{'}DevZone ticket
			</a>
			, please include this information:
		</p>
		<p>
			<small class="me-1">Browser:</small>
			<small>{navigator.userAgent}</small>
			{awsApiGwReqId !== undefined && (
				<>
					<br />
					<small class="me-1">API Gateway Request ID:</small>
					<code>{awsApiGwReqId}</code>
				</>
			)}
			{awsReqId !== undefined && (
				<>
					<br />
					<small class="me-1">Request ID:</small>
					<code>{awsReqId}</code>
				</>
			)}
		</p>
	</div>
)
