import {
	formatTypeBoxErrors,
	validateWithTypeBox,
} from '@hello.nrfcloud.com/proto'
import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import { Context } from '@hello.nrfcloud.com/proto/hello'
import { type Static, type TSchema } from '@sinclair/typebox'

export type ResponseWithDetails = {
	response: Response
	cacheControl: {
		public: boolean
		maxAge?: number
	}
}

export type OkFN<T extends TSchema> = (
	value: Static<T>,
	response: ResponseWithDetails,
) => void
export type FetchProblem = {
	problem: Static<typeof ProblemDetail>
	url: URL
	body?: Record<string, any>
	awsReqId?: string
	awsApiGwReqId?: string
}
type ProblemFN = (details: FetchProblem, response?: ResponseWithDetails) => void
type DoneFN<T extends TSchema> = (
	args: { problem: Static<typeof ProblemDetail> } | { value: Static<T> },
	response?: ResponseWithDetails,
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
				const details = extractDetails(res)
				if (!res.ok) {
					if (res.headers.get('content-type') === 'application/problem+json') {
						const problem = await res.json()
						const fetchProblem = toFetchProblem(problem, url, res, body)
						problemFns.forEach((fn) => fn(fetchProblem, details))
						doneFns.forEach((fn) => fn({ problem }, details))
						console.error(`[validatingFetch]`, problem)
						return
					}
					console.error(
						`Unhandled error response! All errors should be return as ProblemDetail!`,
					)
					const response = await res.text()
					const fetchProblem = toFetchProblem(
						{
							'@context': Context.problemDetail.toString(),
							status: res.status,
							title: response,
						},
						url,
						res,
						body,
					)
					problemFns.forEach((fn) => fn(fetchProblem, details))
					doneFns.forEach((fn) =>
						fn({ problem: fetchProblem.problem }, details),
					)
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
					const fetchProblem = toFetchProblem(
						{
							'@context': Context.problemDetail.toString(),
							status: 400,
							title: 'Validation failed',
							detail: formatTypeBoxErrors(maybeValidResponse.errors),
						},
						url,
						res,
						body,
					)
					problemFns.forEach((fn) => fn(fetchProblem, details))
					doneFns.forEach((fn) =>
						fn({ problem: fetchProblem.problem }, details),
					)
					return
				}

				okFns.forEach((fn) => fn(maybeValidResponse.value, details))
				doneFns.forEach((fn) =>
					fn({ value: maybeValidResponse.value }, details),
				)
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

const extractDetails = (response: Response): ResponseWithDetails => {
	const directives = new Map<string, string>(
		(response.headers.get('cache-control') ?? '')
			.split(',')
			.map((s) => s.trim())
			.map((s) => s.split('=', 2) as [string, string]),
	)

	const cacheControl: ResponseWithDetails['cacheControl'] = {
		public: directives.has('public'),
		maxAge:
			directives.get('max-age') !== undefined
				? parseInt(directives.get('max-age') ?? '0', 10)
				: undefined,
	}
	return {
		response,
		cacheControl,
	}
}

const toFetchProblem = (
	problem: Static<typeof ProblemDetail>,
	url: URL,
	res: Response,
	body?: Record<string, any>,
): FetchProblem => {
	const awsReqId = res.headers.get('x-amzn-requestid') ?? undefined
	const awsApiGwReqId = res.headers.get('Apigw-Requestid') ?? undefined
	const p: FetchProblem = { problem, url }
	if (body !== undefined) p.body = body
	if (awsReqId !== undefined) p.awsReqId = awsReqId
	if (awsApiGwReqId !== undefined) p.awsApiGwReqId = awsApiGwReqId
	return p
}
