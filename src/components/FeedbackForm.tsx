import cx from 'classnames'
import { Angry, Frown, Laugh, Meh, Smile, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useParameters } from '#context/Parameters.js'

import './FeedbackForm.css'

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
	const params = useParameters()

	const submit = () => {
		if (!validate()) return

		setFailed(false)
		setSubmitting(true)
		params.onParameters(async ({ helloApiURL }) => {
			try {
				const res = await fetch(new URL('./feedback', helloApiURL), {
					method: 'POST',
					body: JSON.stringify({
						email,
						suggestion,
						stars,
					}),
				})
				if (res.ok) {
					setSubmitted(true)
				} else {
					setFailed(true)
				}
				setSubmitting(false)
			} catch {
				setFailed(true)
				setSubmitting(false)
			}
		})
	}

	const validate = () => {
		const e: Array<string> = []
		if (stars === 0) e.push('stars')
		if (stars !== 5 && suggestion.length === 0) e.push('suggestion')
		if (!/.+@.+/.test(email)) e.push('email')
		setErrors(e)
		return e.length === 0
	}

	if (submitted) return <p>Thank you for your feedback!</p>

	return (
		<form onSubmit={noop} class="feedback mb-3">
			<p>
				How would you rate <code>hello.nrfcloud.com</code>?
			</p>
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
					<p>
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
					</p>
				</label>
				<input
					type="text"
					class="form-control"
					id="suggestion"
					placeholder={'Your suggestion ...'}
					value={suggestion}
					disabled={submitting}
					required={stars !== 5}
					onChange={(e) =>
						setSuggestion((e.target as HTMLInputElement).value.trim())
					}
				/>
			</div>
			<div class="mb-3">
				<label for="email" class="form-label">
					<p>
						<span>Your email:</span>
						{errors.includes('email') && (
							<span class="color-error light ms-2">
								Please provide your email address.
							</span>
						)}
					</p>
				</label>
				<input
					type="email"
					class="form-control"
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
