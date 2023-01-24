import { FormInput, PlugZap, ToggleRight } from 'lucide-preact'
import { useState } from 'preact/hooks'
import styled from 'styled-components'
import type { DK } from '../DKs'
import { SIMIcon } from './icons/SIMIcon'

const StepsWithIcons = styled.ol`
	text-align: center;
	list-style: none;
	padding: 0;
	svg {
		width: 48px;
		height: 48px;
	}
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}
`

export const SelectedDK = ({
	clear,
	selected,
	setIMEIandPIN,
}: {
	clear: () => unknown
	selected: DK
	setIMEIandPIN: (args: { imei: string; pin: string }) => void
}) => {
	const [imei, setIMEI] = useState<string>('351234567890123')
	const [pin, setPIN] = useState<string>('123456')

	const isValid = /^35[0-9]{13}/.test(imei) && /^[0-9]{6}$/.test(pin)

	return (
		<>
			<h2>Your selection:</h2>
			<section class={'p-1 w-100 text-center'}>
				<img
					alt={`${selected.title} (${selected.model})`}
					src={`/static/images/${selected.model}.webp`}
					class="img-fluid w-50"
				/>
				<p>
					{selected.title} <small>({selected.model})</small>
				</p>
			</section>
			<section class="mb-4">
				<StepsWithIcons>
					<li>
						<SIMIcon /> Insert the SIM card
					</li>
					<li>
						<PlugZap strokeWidth={1} />
						Plug into a USB power source
					</li>
					<li>
						<ToggleRight strokeWidth={1} />
						Turn on
					</li>
					<li>
						<FormInput strokeWidth={1} />
						Enter your devices' IMEI and PIN to see it on the map below
					</li>
				</StepsWithIcons>
			</section>
			<aside class={'d-flex justify-content-center'}>
				<form class="row row-cols-lg-auto g-3 align-items-center">
					<div class="col-12">
						<label class="visually-hidden" for="imeiInput">
							IMEI
						</label>
						<div class="input-group">
							<div class="input-group-text">IMEI</div>
							<input
								type="text"
								minLength={15}
								maxLength={15}
								class="form-control form-control-sm"
								id="imeiInput"
								placeholder="351234567890123"
								value={imei}
								onChange={(e) => {
									setIMEI((e.target as HTMLInputElement).value)
								}}
							/>
						</div>
					</div>

					<div class="col-12">
						<label class="visually-hidden" for="pinInput">
							PIN
						</label>
						<div class="input-group">
							<div class="input-group-text">PIN</div>
							<input
								type="password"
								class="form-control form-control-sm"
								id="pinInput"
								placeholder="123456"
								minLength={6}
								maxLength={6}
								value={pin}
								onChange={(e) => {
									setPIN((e.target as HTMLInputElement).value)
								}}
							/>
						</div>
					</div>
					<div class="col-12">
						<button
							type="button"
							class="btn btn-primary"
							disabled={!isValid}
							onClick={() =>
								setIMEIandPIN?.({
									imei,
									pin,
								})
							}
						>
							Submit
						</button>
						<button
							class={'btn btn-outline-secondary ms-2'}
							onClick={() => clear?.()}
						>
							clear
						</button>
					</div>
				</form>
			</aside>
		</>
	)
}
