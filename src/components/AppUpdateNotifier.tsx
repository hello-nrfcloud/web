import { getItem, setItem } from '#utils/localStorage.js'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { compare, parse } from 'semver'
import { RotateCwIcon } from 'lucide-preact'

export const AppUpdateNotifier = () => {
	const [newerVersion, setNewerVersion] = useState<string | undefined>()
	const [ignored, setIgnored] = useState<string[]>(
		getItem<string[]>('app:ignored_versions') ?? [],
	)

	const checkVersion = useCallback(() => {
		fetch(`/.well-known/release?v=${VERSION}`)
			.then(async (res) => (await res.text()).trim())
			.then(parse)
			.then((releasedVersion) => {
				if (releasedVersion === null) return
				if (compare(releasedVersion, VERSION) > 0) {
					if (ignored.includes(releasedVersion.raw)) {
						console.debug(
							`[App]`,
							`a newer version is available`,
							releasedVersion.raw,
						)
						return
					}
					console.warn(`[App]`, `a newer version is available`, releasedVersion)
					setNewerVersion(releasedVersion.raw)
				} else {
					console.debug(
						`[App]`,
						`release version`,
						releasedVersion.raw,
						`is older`,
					)
				}
			})
			.catch((err) => {
				console.error(`[AppUpdateNotifier]`, err)
			})
	}, [ignored])

	useEffect(() => {
		const i = setInterval(checkVersion, 10 * 60 * 1000)
		checkVersion()
		return () => {
			clearInterval(i)
		}
	}, [checkVersion])

	const ignore = () => () => {
		if (newerVersion === undefined) return
		setItem('app:ignored_versions', [...new Set([...ignored, newerVersion])])
		setIgnored((i) => [...new Set([...i, newerVersion])])
		setNewerVersion(undefined)
		console.log(`[App]`, `ignored newer version`, newerVersion)
	}

	if (newerVersion === undefined) return null
	return (
		<div role="alert" class="bg-sun" style={{ marginBottom: '1px' }}>
			<div class="container">
				<div class="row">
					<div class="col p-2 d-flex justify-content-between align-items-center">
						<div>
							<RotateCwIcon
								size={36}
								strokeWidth={1}
								class="me-2"
								title={`A newer version ({newerVersion}) is available.`}
							/>
							<span>
								A newer version ({newerVersion}) is available. (
								<a
									href="https://github.com/hello-nrfcloud/web/releases"
									target="_blank"
								>
									Release notes
								</a>
								)
							</span>
						</div>
						<span class="flex-shrink-0">
							<button
								type="button"
								class="btn btn-outline-danger"
								onClick={ignore}
							>
								ignore
							</button>
							<a href="./" class="btn btn-outline-secondary ms-2">
								reload
							</a>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
