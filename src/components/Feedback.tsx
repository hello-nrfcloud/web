import { FeedbackForm } from './FeedbackForm.js'

export const Feedback = () => (
	<section class="pt-4 pb-4 bg-dark">
		<div class="container mt-4">
			<div class="row">
				<div class="col-12 col-md-6">
					<h2>Got feedback? Get a t-shirt!</h2>
					<FeedbackForm />
				</div>
				<div class="col-12 col-md-4">
					<p>
						Every month, we'll select 5 new suggestions or feedback posts on{' '}
						<a
							href="https://devzone.nordicsemi.com/support/add"
							target="_blank"
						>
							{'{DevZone'}
						</a>{' '}
						that are tagged with{' '}
						<a
							href="https://devzone.nordicsemi.com/f/nordic-q-a/tags/hello-nrfcloud"
							target="_blank"
						>
							<code>hello-nrfcloud</code>
						</a>{' '}
						that we liked best and give out a little present. It could be a
						T-Shirt; or something else and we may at any time decide to not hand
						out gifts, just so you know.
					</p>
					<p>Regardless, we will read all your feedback!</p>
				</div>
				<div class="col-12 col-md-2">
					<p>
						<img
							src="/static/images/t-shirt.webp?v=2"
							alt="A person wearing a black t-shirt that reads: hello, I connected a Nordic DK to the Internet before I had my first coffee!"
							class="img-fluid"
						/>
					</p>
					<p>
						<small>Picture used solely for illustrative purposes.</small>
						<br />
						<small>
							Photo by <a href="https://unsplash.com/es/@sadswim">ian dooley</a>{' '}
							on <a href="https://unsplash.com/photos/kkj9iKxsdhY">Unsplash</a>.
						</small>
					</p>
				</div>
			</div>
		</div>
	</section>
)
