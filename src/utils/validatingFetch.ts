import {
	formatTypeBoxErrors,
	validateWithTypeBox,
} from '@hello.nrfcloud.com/proto'
import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import { Context } from '@hello.nrfcloud.com/proto/hello'
import { type Static, type TSchema } from '@sinclair/typebox'

type OkFN<T extends TSchema> = (value: Static<T>) => void
export type FetchProblem = {
	problem: Static<typeof ProblemDetail>
	url: URL
	body?: Record<string, any>
	awsReqId?: string
	awsApiGwReqId?: string
}
type ProblemFN = (details: FetchProblem) => void
type DoneFN<T extends TSchema> = (
	args: { problem: Static<typeof ProblemDetail> } | { value: Static<T> },
) => void
type StartFN = (url: URL, body?: Record<string, any>) => void

export type ResultHandlers<T extends TSchema> = {
	ok: (okFn: OkFN<T>) => ResultHandlers<T>
	problem: (problemFn: ProblemFN) => ResultHandlers<T>
	done: (doneFn: DoneFN<T>) => ResultHandlers<T>
	start: (startFn: StartFN) => ResultHandlers<T>
}

export const validatingFetch = <T extends TSchema>(
	expectedType: T,
): ((
	url: URL,
	body?: Record<string, any>,
	method?: string,
) => ResultHandlers<T>) => {
	const validate = validateWithTypeBox(expectedType)
	return (
		url: URL,
		body?: Record<string, any>,
		method?: string,
	): ResultHandlers<T> => {
		const problemFns: ProblemFN[] = []
		const okFns: OkFN<T>[] = []
		const doneFns: DoneFN<T>[] = []
		fetch(
			url,
			body !== undefined
				? {
						method: method ?? 'POST',
						body: JSON.stringify(body),
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
						},
					}
				: {
						method: method ?? 'GET',
						mode: 'cors',
					},
		)
			.then(async (res) => {
				const awsReqId = res.headers.get('x-amzn-requestid') ?? undefined
				const awsApiGwReqId = res.headers.get('Apigw-Requestid') ?? undefined
				if (!res.ok) {
					if (res.headers.get('content-type') === 'application/problem+json') {
						const problem = await res.json()
						problemFns.forEach((fn) =>
							fn({
								problem,
								url,
								body,
								awsReqId,
								awsApiGwReqId,
							}),
						)
						doneFns.forEach((fn) => fn({ problem }))
						console.error(`[validatingFetch]`, problem)
						return
					}
					console.error(
						`Unhandled error response! All errors should be return as ProblemDetail!`,
					)
					const response = await res.text()
					const problem = {
						'@context': Context.problemDetail.toString(),
						status: res.status,
						title: response,
					}
					problemFns.forEach((fn) =>
						fn({ problem, url, body, awsReqId, awsApiGwReqId }),
					)
					doneFns.forEach((fn) => fn({ problem }))
					return
				}
				const response =
					parseInt(res.headers.get('content-length') ?? '0', 10) > 0
						? await res.json()
						: undefined
				const maybeValidResponse = validate(response)
				if ('errors' in maybeValidResponse) {
					console.error(
						`[validatingFetch]`,
						`Invalid response received`,
						response,
						maybeValidResponse.errors,
					)
					const problem: Static<typeof ProblemDetail> = {
						'@context': Context.problemDetail.toString(),
						status: 400,
						title: 'Validation failed',
						detail: formatTypeBoxErrors(maybeValidResponse.errors),
					}
					problemFns.forEach((fn) =>
						fn({ problem, url, body, awsReqId, awsApiGwReqId }),
					)
					doneFns.forEach((fn) => fn({ problem }))
					return
				}

				okFns.forEach((fn) => fn(maybeValidResponse.value))
				doneFns.forEach((fn) => fn({ value: maybeValidResponse.value }))
			})
			.catch((err) => {
				const problem: Static<typeof ProblemDetail> = {
					'@context': Context.problemDetail.toString(),
					status: 500,
					title: err.message,
					detail: err.toString(),
				}
				problemFns.forEach((fn) => fn({ problem, url, body }))
				doneFns.forEach((fn) => fn({ problem }))
				return
			})
		const handlers: ResultHandlers<T> = {
			ok: (fn) => {
				okFns.push(fn)
				return handlers
			},
			problem: (fn) => {
				problemFns.push(fn)
				return handlers
			},
			done: (fn) => {
				doneFns.push(fn)
				return handlers
			},
			start: (fn) => {
				fn(url, body)
				return handlers
			},
		}
		return handlers
	}
}
