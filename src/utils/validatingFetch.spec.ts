import { SIMDetails } from '#api/getSIMDetails.js'
import type { Static } from '@sinclair/typebox'
import nock from 'nock'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import {
	validatingFetch,
	type FetchProblem,
	type ResponseWithDetails,
} from './validatingFetch.js'
import { addSeconds } from 'date-fns'

void describe('validatingFetch', async () => {
	void it('should return the cache headers', async () => {
		const now = new Date()
		const scope = nock('https://api.sim-details.nordicsemi.cloud/')
		scope.get(`/2024-07-01/sim/89457300000022396157`).reply(
			200,
			{
				timestamp: now.toISOString(),
				usedBytes: 0,
				totalBytes: 10000000,
			},
			{
				'content-type': 'application/json',
				'content-length': '76',
				'cache-control': 'public, max-age=300',
				expires: addSeconds(new Date(), 300).toUTCString(),
			},
		)

		const [sim, { response, cacheControl }] = await new Promise<
			[Static<typeof SIMDetails>, ResponseWithDetails]
		>((resolve, reject) => {
			validatingFetch(SIMDetails)(
				new URL(
					'https://api.sim-details.nordicsemi.cloud/2024-07-01/sim/89457300000022396157',
				),
			)
				.ok((...args) => resolve(args))
				.problem(reject)
		})

		assert.deepEqual(
			cacheControl,
			{
				public: true,
				maxAge: 300,
			},
			'It should have parsed the cache-control header',
		)
		assert.equal(response.status, 200, 'It should return the status code')
		assert.deepEqual(sim, {
			timestamp: now.toISOString(),
			usedBytes: 0,
			totalBytes: 10000000,
		})
		assert.equal(nock.isDone(), true)
	})

	void it('should return the cache headers on errors', async () => {
		const scope = nock('https://api.sim-details.nordicsemi.cloud/')
		scope.get(`/2024-07-01/sim/89457300000022396158`).reply(409, '', {
			'content-length': '760',
			'cache-control': 'public, max-age=60',
			expires: new Date().toUTCString(),
		})

		const [problem, responseDetails] = await new Promise<
			[details: FetchProblem, response?: ResponseWithDetails]
		>((resolve, reject) => {
			validatingFetch(SIMDetails)(
				new URL(
					'https://api.sim-details.nordicsemi.cloud/2024-07-01/sim/89457300000022396158',
				),
			)
				.ok(() => reject(new Error('Should not be ok')))
				.problem((...args) => resolve(args))
		})

		assert.deepEqual(problem, {
			problem: {
				'@context': 'https://github.com/hello-nrfcloud/proto/ProblemDetail',
				status: 409,
				title: '', // response body
			},
			url: new URL(
				'https://api.sim-details.nordicsemi.cloud/2024-07-01/sim/89457300000022396158',
			),
		})

		assert.equal(
			responseDetails !== undefined,
			true,
			'It should return the response details',
		)

		const { cacheControl, response } = responseDetails!
		assert.equal(response.status, 409, 'It should return the status code')
		assert.deepEqual(
			cacheControl,
			{
				public: true,
				maxAge: 60,
			},
			'It should have parsed the cache-control header',
		)

		assert.equal(nock.isDone(), true)
	})
})
