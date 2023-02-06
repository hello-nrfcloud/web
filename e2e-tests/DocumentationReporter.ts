// playwright.config.ts
import type {
	FullConfig,
	FullResult,
	Reporter,
	Suite,
	TestCase,
	TestResult,
} from '@playwright/test/reporter'

export default class DocumentationReporter implements Reporter {
	onBegin(_: FullConfig, suite: Suite): void {
		console.log(`Starting the run with ${suite.allTests().length} tests`)
	}

	onTestBegin(test: TestCase, _: TestResult): void {
		console.log(`Starting test ${test.title}`)
	}

	onTestEnd(test: TestCase, result: TestResult): void {
		console.log(`Finished test ${test.title}: ${result.status}`)
		console.log(result.attachments)
	}

	onEnd(result: FullResult): void {
		console.log(`Finished the run: ${result.status}`)
	}
}
