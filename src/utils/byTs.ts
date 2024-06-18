export const byTs = (
	{ ts: t1 }: { ts: Date },
	{ ts: t2 }: { ts: Date },
): number => t2.getTime() - t1.getTime()
