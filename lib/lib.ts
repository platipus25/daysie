import { compareDesc, differenceInCalendarDays } from 'date-fns'
import Hashids from 'hashids'
import { Incident } from '@prisma/client'

export const hashids = new Hashids("this is my salt", 8);

export function latestIncident(incidents: Incident[]): Incident {
    incidents.sort((a, b) => compareDesc(a.date, b.date))

    if (incidents[0]) {
        return incidents[0]
    }
    return null
}

export function countDays(incidents: Incident[]): number | null {
    const dates = incidents.map(incident => new Date(incident.date))

    dates.sort((a, b) => compareDesc(a, b))

    if (dates[0] === undefined) {
        return null
    }

    const date = dates[0];
    const today = new Date();

    const diff = differenceInCalendarDays(today, date);

    return diff
}