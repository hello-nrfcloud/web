import { SIMDetails } from '#api/getSIMDetails.js'
import type { Static } from '@sinclair/typebox'
import nock from 'nock'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { validatingFetch, type ResponseWithDetails } from './validatingFetch.js'

void describe('validatingFetch', async () => {
	void it('should return the cache headers', async () => {
		const scope = nock('https://api.sim-details.nordicsemi.cloud/')
		scope.get(`/2024-07-01/sim/89457300000022396157`).reply(
			200,
			{
				timestamp: '2024-07-01T10:53:16.790Z',
				usedBytes: 0,
				totalBytes: 10000000,
			},
			{
				'content-type': 'application/json',
				'content-length': '76',
				'cache-control': 'public, max-age=300',
				expires: 'Thu, 04 Jul 2024 08:08:34 GMT',
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
			timestamp: '2024-07-01T10:53:16.790Z',
			usedBytes: 0,
			totalBytes: 10000000,
		})
		assert.equal(nock.isDone(), true)
	})
})
