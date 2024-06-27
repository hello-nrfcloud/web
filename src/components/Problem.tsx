import type { FetchProblem } from '#utils/validatingFetch.js'

export const Problem = ({
	problem: { problem, awsApiGwReqId, awsReqId },
	class: className,
}: {
	problem: FetchProblem
	class?: string
}) => (
	<div class={`alert alert-danger problem ${className}`}>
		{problem.title}
		{problem.detail !== undefined && (
			<>
				<br />
				<small>{problem.detail}</small>
			</>
		)}
		{awsApiGwReqId !== undefined && (
			<>
				<br />
				<small>API Gateway Request ID</small>
				<code>{awsApiGwReqId}</code>
			</>
		)}
		{awsReqId !== undefined && (
			<>
				<br />
				<small>Request ID</small>
				<code>{awsReqId}</code>
			</>
		)}
	</div>
)
