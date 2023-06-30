import { isFingerprint } from '@hello.nrfcloud.com/proto/fingerprint'
import { useState } from 'preact/hooks'
import { Secondary } from './buttons/Button.js'

export const FingerprintForm = () => {
	const [productionRun, setProductionRun] = useState<string>('92b')
	const [token, setToken] = useState<string>('d3c4fb')
	const fingerprint = `${productionRun}.${token}`
	const isValid = isFingerprint(fingerprint)
	return (
		<form class="row row-cols-lg-auto g-3 align-items-center">
			<div class="col-12">
				<label class="visually-hidden" htmlFor="productionRunInput">
					Fingerprint
				</label>
				<div class="input-group">
					<div class="input-group-text">{DOMAIN_NAME}/</div>
					<input
						type="text"
						minLength={1}
						class="form-control form-control-sm"
						id="productionRunInput"
						placeholder="92b"
						value={productionRun}
						onChange={(e) => {
							setProductionRun((e.target as HTMLInputElement).value)
						}}
						size={2}
					/>
					<div class="input-group-text">.</div>
					<input
						type="text"
						minLength={6}
						maxLength={6}
						class="form-control form-control-sm"
						id="tokenInput"
						placeholder="d3c4fb"
						value={token}
						onChange={(e) => {
							setToken((e.target as HTMLInputElement).value)
						}}
						size={6}
					/>
				</div>
			</div>
			<div class="col-12">
				<Secondary
					disabled={!isValid}
					onClick={() => {
						window?.location.assign(`/${fingerprint}`)
					}}
				>
					Submit
				</Secondary>
			</div>
		</form>
	)
}
