export const ProgressBar = ({ class: className }: { class?: string }) => (
	<div class={`progress ${className ?? ''}`}>
		<div
			class="progress-bar progress-bar-striped progress-bar-animated"
			role="progressbar"
			aria-label="Animated striped example"
			aria-valuenow={50}
			aria-valuemin={0}
			aria-valuemax={100}
			style="width: 50%"
		/>
	</div>
)
