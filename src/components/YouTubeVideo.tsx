import { getItem, setItem } from '#utils/localStorage.js'
import { YoutubeIcon } from 'lucide-preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import './YouTubeVideo.css'

export const YouTubeVideo = ({ id, title }: { id: string; title: string }) => {
	const [consentGiven, giveConsent] = useState<boolean>(
		getItem('youtubeConsent') ?? false,
	)
	const containerRef = useRef<HTMLDivElement>(null)
	const [videoSize, setVideoSize] = useState<[width: number, height: number]>([
		560, 315,
	])

	useEffect(() => {
		if (containerRef.current === null) return
		const { width } = containerRef.current.getBoundingClientRect()
		setVideoSize([width, width * (9 / 16)])
	}, [containerRef.current])
	return (
		<aside class="mt-4">
			<h2>Video: {title}</h2>
			{consentGiven && (
				<iframe
					width={videoSize[0]}
					height={videoSize[1]}
					src={`https://www.youtube-nocookie.com/embed/${id}`}
					title={title}
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe>
			)}

			<div ref={containerRef}>
				{!consentGiven && (
					<div
						class="yt-consent mb-2 text-white d-flex align-items-end justify-content-center"
						style={{
							backgroundImage: `url(/static/images/youtube/${encodeURIComponent(
								id,
							)}.webp)`,
						}}
					>
						<div class="px-4">
							<p class="mb-0">
								<label>
									<input
										type="checkbox"
										onInput={() => {
											giveConsent(true)
											setItem('youtubeConsent', true)
										}}
									/>{' '}
									I agree to{' '}
									<a
										href="https://policies.google.com/privacy"
										target="_blank"
										style={{ color: 'inherit' }}
									>
										YouTube's privacy terms
									</a>
									.
								</label>
							</p>
							<p>
								<small>
									In order to watch the YouTube video on this page, you must
									agree to YouTube's privacy terms.
								</small>
							</p>
						</div>
					</div>
				)}
			</div>
			<p class="d-flex align-items-center">
				<YoutubeIcon class="me-1" />{' '}
				<span>
					Watch the video{' '}
					<a href={`https://www.youtube.com/watch?v=${id}`}>on YouTube</a>.
				</span>
			</p>
		</aside>
	)
}
