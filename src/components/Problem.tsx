import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const Problem = ({
	problem,
	class: className,
}: {
	problem: Static<typeof ProblemDetail>
	class?: string
}) => (
	<div class={`alert alert-danger problem ${className}`}>{problem.title}</div>
)
