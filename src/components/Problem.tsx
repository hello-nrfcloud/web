import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const Problem = ({
	problem,
}: {
	problem: Static<typeof ProblemDetail>
}) => <div class="alert alert-danger problem">{problem.title}</div>
