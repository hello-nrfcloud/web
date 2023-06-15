export const WaitingForDevice = () => (
	<>
		<h2>Connecting...</h2>
		<div
			class="progress"
			role="progressbar"
			aria-label="Animated striped example"
			aria-valuenow={50}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div
				class="progress-bar progress-bar-striped progress-bar-animated"
				style="width: 50%"
			></div>
		</div>
	</>
)
