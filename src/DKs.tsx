export enum TagName {
	cellular = 'Cellular',
	wifi = 'Wi-Fi',
	nRF9160DK = 'PCA10090',
	nRF7002DK = 'PCA10143',
	Thingy91 = 'PCA20035',
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
		tags: [TagName.cellular, TagName.nRF9160DK],
		learnMoreLink:
			'https://www.nordicsemi.com/Products/Development-hardware/nrf9160-dk',
	},
	PCA10143: {
		model: 'PCA10143',
		title: 'nRF7002 DK',
		description:
			'The nRF7002 DK (PCA10143) is a single-board development kit for evaluation and development on the Nordic nRF7002, a Wi-Fi companion IC to Nordic nRF5340 System-on-Chip (SoC) host processor.',
		tags: [TagName.wifi, TagName.nRF7002DK],
		learnMoreLink:
			'https://www.nordicsemi.com/Products/Development-hardware/nr7002-pdk',
	},
	PCA20035: {
		model: 'PCA20035',
		title: 'Thingy:91',
		description:
			'The Nordic Thingy:91 is an easy-to-use battery-operated prototyping platform for cellular IoT using LTE-M, NB-IoT and GNSS. It is ideal for creating Proof-of-Concept (PoC), demos and initial prototypes in your cellular IoT development phase.',
		tags: [TagName.cellular, TagName.Thingy91],
		learnMoreLink:
			'https://www.nordicsemi.com/Products/Development-hardware/Nordic-Thingy-91',
	},
}
