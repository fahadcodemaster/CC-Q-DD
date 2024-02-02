import { formatDistanceToNow } from "date-fns"

/**
* @function timeElapsedSinceDate
* @description takes in timestamp and returns time distance from now in words 
* @param {timestamp} ISOString example input: 2018-12-01T01:27:37.000Z
**/
export const timeElapsedSinceDate = (timestamp: ISOstring | null) => {
    if (!timestamp) return ''
    //TODO: this function dgaf currently about timezones. not even sure what timezone input timestamps are in.
    const [date, time] = timestamp.split(/T|Z/)
    const [year, month, day] = date.split("-")
    const [hours, minutes, seconds] = time.split(/[:]|[.]/)

    const zeroIndexMonth: number = +month - 1

    return formatDistanceToNow(
        new Date(+year, zeroIndexMonth, +day, +hours, +minutes, +seconds),
        {
            addSuffix: true,
            includeSeconds: true,
        })
}

/**
* @function formatTimestampReadable
* @description takes in timestamp and returns human readable timestamp
* @param {timestamp} ISOString example input: 2018-12-01T01:27:37.000Z
**/
export const formatTimestampReadable = (timestamp: ISOstring | null) => {
    if (!timestamp) return ''
    //TODO: this function dgaf currently about timezones. not even sure what timezone input timestamps are in.
    const [date, time] = timestamp.split(/T|Z/)
    const [year, month, day] = date.split("-")
    const [hours, minutes, seconds] = time.split(/[:]|[.]/)

    return `${month}/${day}/${year}`
}