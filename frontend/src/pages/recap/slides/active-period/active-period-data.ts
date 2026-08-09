export const MONTHS = [
  { name: "Январь", shortName: "Янв" },
  { name: "Февраль", shortName: "Фев" },
  { name: "Март", shortName: "Мар" },
  { name: "Апрель", shortName: "Апр" },
  { name: "Май", shortName: "Май" },
  { name: "Июнь", shortName: "Июн" },
  { name: "Июль", shortName: "Июл" },
  { name: "Август", shortName: "Авг" },
  { name: "Сентябрь", shortName: "Сен" },
  { name: "Октябрь", shortName: "Окт" },
  { name: "Ноябрь", shortName: "Ноя" },
  { name: "Декабрь", shortName: "Дек" },
] as const

export interface ActivePeriod {
  year: number
  monthNumber: number
  monthName: string
  shortMonthName: string
}

export function parseActivePeriod(value: string | undefined): ActivePeriod | null {
  if (!value) {
    return null
  }

  const match = value.match(/^(\d{4})-(0[1-9]|1[0-2])$/)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const monthNumber = Number(match[2])
  const month = MONTHS[monthNumber - 1]

  return {
    year,
    monthNumber,
    monthName: month.name,
    shortMonthName: month.shortName,
  }
}
