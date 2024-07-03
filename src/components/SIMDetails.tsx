import { getSIMDetails } from '#api/getSIMDetails.js'
import { useParameters } from '#context/Parameters.js'
import { type Issuer, identifyIssuer } from 'e118-iin-list'
import type { VNode } from 'preact'
import { useEffect, useState } from 'preact/hooks'

export type SIMUsage = {
	used: number
	total: number
	/**
	 * As float, 0-1
	 */
	availablePercent: number
	ts: Date
	availableBytes: number
}

export const SIMDetails = ({
	iccid,
	children,
}: {
	iccid: string
	children: (details: {
		issuer?: Issuer
		usage?: SIMUsage
	}) => VNode<any> | null
}): VNode<any> | null => {
	const { onParameters } = useParameters()
	const [issuer, setIssuer] = useState<Issuer | undefined>(undefined)
	const [usage, setUsage] = useState<SIMUsage | undefined>(undefined)

	useEffect(() => {
		if (iccid === undefined) return
		setIssuer(identifyIssuer(iccid))
	}, [iccid])

	useEffect(() => {
		if (issuer === undefined) return
		if (iccid === undefined) return
		if (issuer.iin === 894573) {
			// Onomondo SIM
			onParameters(({ simDetailsAPIURL }) => {
				getSIMDetails(new URL(simDetailsAPIURL))(iccid).ok(
					({ totalBytes, usedBytes, timestamp }) => {
						setUsage({
							used: usedBytes,
							total: totalBytes,
							availablePercent: 1 - usedBytes / totalBytes,
							availableBytes: totalBytes - usedBytes,
							ts: new Date(timestamp),
						})
					},
				)
			})
		}
	}, [issuer, iccid])

	return children({ issuer, usage })
}
