import { format } from 'date-fns'

export const encodeWeek = (date?: Date): string =>
	parseInt(`${format(date ?? new Date(), 'yyw')}`, 10).toString(16)
