export type Resource = {
	title: string
	description: string
	callToAction: {
		text: string
		link: string
	}
	tags: string[]
}

export const resources: Resource[] = [
	{
		title: 'Set up your development environment',
		description: `To begin using the nRF Connect SDK, it is recommended to start with this guide. 

        Make sure that you have completed all the mentioned step to avoid problems later in the development process.`,
		callToAction: {
			text: `Get stared with our SDK!`,
			link: 'https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/getting_started.html',
		},
		tags: ['level:100', 'family:nRF9', 'family:nRF7'],
	},
	{
		title: 'nRF Connect SDK Fundamentals',
		description:
			'Learn how to develop rich portable RTOS-based applications to power your next future-proof IoT product.',
		callToAction: {
			text: `Take the course!`,
			link: 'https://academy.nordicsemi.com/courses/nrf-connect-sdk-fundamentals/',
		},
		tags: ['level:100', 'family:nRF9', 'family:nRF7'],
	},
	{
		title: 'Cellular IoT Fundamentals',
		description:
			'Cellular IoT Fundamentals is a self-paced hands-on online course focusing on learning the essentials of cellular IoT application development using the highly extensible and feature-rich nRF Connect SDK.',
		callToAction: {
			text: `Take the course!`,
			link: 'https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/',
		},
		tags: ['level:100', 'family:nRF9'],
	},
	{
		title: 'Location, location, location',
		description:
			'nRF Cloud Location Services lets you obtain location data for your devices. Location data is critical for many types of devices and use cases, for example, asset tracking, wearables, smart appliances, and point-of-sale payment terminals. nRF Cloud Location Services offers faster location fixes, improved location accuracy, and greater power savings.',
		callToAction: {
			text: `Follow the tutorial!`,
			link: 'https://docs.nrfcloud.com/LocationServices/Tutorials/Introduction/',
		},
		tags: ['level:100', 'family:nRF9'],
	},
	{
		title: 'Cellular connectivity',
		description:
			'The LTE Link Monitor is a modem client application that monitors the modem/link status and activity using AT commands.',
		callToAction: {
			text: `Follow the tutorial!`,
			link: 'https://infocenter.nordicsemi.com/index.jsp?topic=%2Fug_link_monitor%2FUG%2Flink_monitor%2Flm_intro.html',
		},
		tags: ['level:100', 'family:nRF9'],
	},
	{
		title: `nRF9160 Hardware Integration Guide`,
		description: `This document complements the nRF9160 Product Specification to provide recommendations and guidelines for designing devices based on the nRF9160 module.`,
		callToAction: {
			link: `https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/sip/nrf9160-sip/hardware-integration-guide/nrf9160hardwareintegrationguidev12.pdf`,
			text: `Read the guide`,
		},
		tags: ['level:200', 'family:nRF9', 'model:PCA10090'],
	},
	{
		title: `Build an Asset Tracker from Scratch`,
		description: `Complete this 200 level intermediate tutorial that explains how to build a full-feature asset tracking application from scratch.`,
		callToAction: {
			link: `https://nordicsemi.com/`,
			text: `Take the course!`,
		},
		tags: ['level:200', 'family:nRF9'],
	},
	{
		title: `Protocols for cellular IoT`,
		description: `What are the important factors to be considered for sending data to the cloud? And what protocols do you need for the IoT connectivity to actually work? Register and our experts will teach you about the key selection factors and protocols to be considered for your cellular IoT product development. Before the Q&A session at the end, we will show you different ways of doing a proof-of-concept with cloud connectivity.`,
		callToAction: {
			link: `https://webinars.nordicsemi.com/cloud-connectivity-and-protocols-5`,
			text: `Watch the webinar`,
		},
		tags: ['level:200', 'webinar', 'family:nRF9'],
	},
	{
		title: `Ultra-low power`,
		description: `The Power Profiler Kit II is an easy to use tool for power profiling all Nordic DKs, including the nRF9160 DK, in addition to custom HW. It can be used throughout all stages of the engineering process to speed up development of ultra low-power short range and cellular IoT applications.`,
		callToAction: {
			link: `https://www.youtube.com/watch?v=B42lPvkUSoc`,
			text: `Watch the video`,
		},
		tags: ['level:200', 'video', 'ultra low-power'],
	},
	{
		title: `Power-optimizing cellular applications`,
		description: `An nRF9160 DK can draw current ranging from a few micro amperes (in sleep mode) to hundreds of milli amperes (when the radio is active). To achieve long battery life, it is crucial that the application is optimized in the use of the radio.`,
		callToAction: {
			link: `https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/app_power_opt.html#cellular-applications`,
			text: `Read the guide`,
		},
		tags: ['level:200', 'ultra low-power', 'family:nRF9'],
	},
	{
		title: 'Fleet management',

		description: `
				Take this 300 level advanced course to learn how to deploy
				and maintain a large fleet of devices.
			`,
		callToAction: {
			link: 'https://nordicsemi.com/',
			text: 'Take the course!',
		},
		tags: ['level:300', `family:nRF9`],
	},
	{
		title: 'Connection tracking',

		description: `
				With the “Trace Collector V2 Preview” which is part of the
				“nRF Connect for Desktop” you are able to get live traces
				between you application, modem and the cellular network:
			`,
		callToAction: {
			link: 'https://infocenter.nordicsemi.com/topic/ug_trace_collector/UG/trace_collector/intro.html',
			text: 'Read the guide!',
		},
		tags: ['level:300', `family:nRF9`],
	},
	{
		title: 'nRF9160 Guidelines',

		description: `
				This documents contain guidelines for hardware design,
				integration, and verification for nRF9160.
			`,
		callToAction: {
			link: 'https://infocenter.nordicsemi.com/topic/struct_nrf91/struct/nrf91_guidelines.html',
			text: 'Read the guide!',
		},
		tags: ['level:300', `family:nRF9`, 'model:PCA10090'],
	},
	{
		title: 'Online Power Profiler for LTE',

		description: `
				Use this tool to estimate the current consumption of the
				nRF91 LTE modem. The OPP supports both NB-IoT (cat NB1)
				and LTE-M (cat M1), and several other network parameters.
			`,
		callToAction: {
			link: 'https://devzone.nordicsemi.com/power/w/opp/3/online-power-profiler-for-lte',
			text: 'Use the tool!',
		},
		tags: ['level:300', 'ultra low-power', `family:nRF9`],
	},
]
