import { isSSR } from '#utils/isSSR.js'
import { isFingerprint } from '@hello.nrfcloud.com/proto/fingerprint'

export const Page = ({ is404 }: { is404: boolean }) => {
	if (!isSSR) {
		const maybeFingerprint = document.location.pathname?.slice(1)
		if (isFingerprint(maybeFingerprint)) {
			document.location.href = `/?fingerprint=${maybeFingerprint}`
		}
	}
	if (is404) {
		return (
			<>
				<h1>404 Page Not Found</h1>
				<p>This page could not be found.</p>
			</>
		)
	} else {
		return (
			<>
				<h1>500 Internal Server Error</h1>
				<p>Something went wrong.</p>
			</>
		)
	}
}
