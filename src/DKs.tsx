export enum TagName {
	cellular = 'Cellular',
	wifi = 'Wi-Fi',
	PCA10090 = 'PCA10090',
	PCA10143 = 'PCA10143',
}

export type DK = {
	model: string
	title: string
	description: string
	tags: TagName[]
	learnMoreLink: string
}

export const DKs: Readonly<Record<string, DK>> = {
	PCA10090: {
		model: 'PCA10090',
		title: 'nRF9160 DK',
		description:
			'The nRF9160 DK (PCA10090) is an affordable, pre-certified single-board development kit for evaluation and development on the nRF9160 SiP for LTE-M, NB-IoT and GNSS. It also includes an nRF52840 board controller that for example can be used to build a Bluetooth Low Energy gateway.',
		tags: [TagName.cellular, TagName.PCA10090],
		learnMoreLink:
			'https://www.nordicsemi.com/Products/Development-hardware/nrf9160-dk',
	},
	PCA10143: {
		model: 'PCA10143',
		title: 'nRF7002 PDK',
		description:
			'The nRF7002 DK (PCA10143) is a single-board development kit for evaluation and development on the Nordic nRF7002, a Wi-Fi companion IC to Nordic nRF5340 System-on-Chip (SoC) host processor.',
		tags: [TagName.wifi, TagName.PCA10143],
		learnMoreLink:
			'https://www.nordicsemi.com/Products/Development-hardware/nr7002-pdk',
	},
}
