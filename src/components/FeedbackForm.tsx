import { useParameters } from '#context/Parameters.js'
import { isSSR } from '#utils/isSSR.js'
import cx from 'classnames'
import { Angry, Frown, Laugh, Meh, Smile, X } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'

import './FeedbackForm.css'

const browser = isSSR ? 'unknown' : (navigator?.userAgent ?? 'unknown')

const noop = (ev: Event) => {
	ev.preventDefault()
	ev.stopPropagation()
}
export const FeedbackForm = () => {
	const [stars, setStars] = useState<number>(0)
	const [errors, setErrors] = useState<Array<string>>([])
	const [suggestion, setSuggestion] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [submitted, setSubmitted] = useState<boolean>(false)
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [failed, setFailed] = useState<boolean>(false)
	const [userSubmitted, setUserSubmitted] = useState<boolean>(false)
	const params = useParameters()

	const submit = () => {
		if (!validate()) return

		setUserSubmitted(true)
		setFailed(false)
		setSubmitting(true)

		params.onParameters(async ({ helloApiURL }) => {
			try {
				const res = await fetch(new URL('./feedback', helloApiURL), {
					method: 'POST',
					body: JSON.stringify({
						email,
						stars,
						suggestion,
						browser,
					}),
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
					},
				})
				if (res.ok) {
					setSubmitted(true)
				} else {
					setFailed(true)
				}
				setSubmitting(false)
				setUserSubmitted(false)
			} catch {
				setFailed(true)
				setSubmitting(false)
				setUserSubmitted(false)
			}
		})
	}

	const validate = () => {
		const e: Array<string> = []
		if (stars === 0) e.push('stars')
		if (suggestion.trim().length === 0) e.push('suggestion')
		if (!/.+@.+/.test(email)) e.push('email')
		setErrors(e)
		return e.length === 0
	}

	useEffect(() => {
		if (!userSubmitted) return
		validate()
	}, [suggestion, email, stars, userSubmitted])

	if (submitted) return <p>Thank you for your feedback!</p>

	return (
		<form onSubmit={noop} class="feedback mb-3">
			<h2>
				How would you rate <code>hello.nrfcloud.com</code>?
			</h2>
			<p class="star-rating">
				<span class={cx('stars', { error: errors.includes('stars') })}>
					{[1, 2, 3, 4, 5].map((rating) => (
						<button
							type="button"
							onClick={() => {
								setStars(rating)
								setErrors((e) => e.filter((s) => s !== 'stars'))
							}}
							class={cx('star', { active: rating <= stars })}
						>
							{stars > 0 ? (rating <= stars ? '★' : '☆') : '☆'}
						</button>
					))}
				</span>
				{errors.includes('stars') && (
					<span class="color-error light">Please select a star rating!</span>
				)}
				<span>
					{stars === 1 && <Angry />}
					{stars === 2 && <Frown />}
					{stars === 3 && <Meh />}
					{stars === 4 && <Smile />}
					{stars === 5 && <Laugh />}
					{stars > 0 && (
						<button type="button" onClick={() => setStars(0)}>
							<X />
						</button>
					)}
				</span>
			</p>
			<div class="mb-3">
				<label for="suggestion" class="form-label">
					<span>
						We are interested to learn what you specifically liked, or didn't
						like, and maybe what's missing!
					</span>
					{errors.includes('suggestion') && (
						<span class="color-error light ms-2">
							Please name a thing or two that would make you give
							hello.nrfcloud.com five stars?
						</span>
					)}
				</label>
				<textarea
					type="text"
					class={cx('form-control', {
						'is-invalid': errors.includes('suggestion'),
					})}
					id="suggestion"
					placeholder={'Your suggestion ...'}
					value={suggestion}
					disabled={submitting}
					required={true}
					onChange={(e) => setSuggestion((e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="mb-3">
				<label for="email" class="form-label">
					<span>Your email:</span>
					{errors.includes('email') && (
						<span class="color-error light ms-2">
							Please provide your email address.
						</span>
					)}
				</label>
				<input
					type="email"
					class={cx('form-control', {
						'is-invalid': errors.includes('email'),
					})}
					id="email"
					placeholder={'Your email'}
					value={email}
					required={true}
					disabled={submitting}
					onChange={(e) =>
						setEmail((e.target as HTMLInputElement).value.trim())
					}
				/>
			</div>
			<div class="mb-3">
				<p>Your browser:</p>
				<p>{browser}</p>
			</div>
			<div class="d-flex justify-content-end align-items-center">
				{failed && (
					<span class="color-error light me-2">
						Ooops, something went wrong!
					</span>
				)}
				<button
					type="button"
					class={'btn btn-primary'}
					onClick={() => {
						submit()
					}}
					disabled={submitting}
				>
					{submitting ? 'sending ...' : 'submit'}
				</button>
			</div>
		</form>
	)
}
