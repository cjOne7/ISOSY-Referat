export const nameRegex = new RegExp(
  "^[a-zàáâäãåąčćçďęèéêëėěįìíîïłŁòóôöõőøùúűûüųūůñńňťšÿýżźžřß∂ðŒÆ ']+$",
  "i"
)
export const phoneFlapRegex = /^[*]?\d{3}$/

/**
 * Details for regular expression:
 * * ^ - start of string
 * * (?=(?:\D*\d){9,15}\D*$) - a positive lookahead that makes sure there are 9 to 15 sequences of non-digits followed with 1 digit, and then has 0+ digits up to the end of string
 * * \+? - an optional + symbol
 * * [0-9]{1,3} - 1 to 3 digits
 * * [\s-]? - an optional whitespace or -
 * * [0-9]{1,5} - 1 to 5 digits
 * * [-\s]? - an optional whitespace or -
 * * [0-9] - a digit
 * * [\d\s-]{5,11} - 5 to 11 digits, whitespaces or -
 * * $ - end of string.
 *
 * Correct variants:
 * * +420-773-089-03-01-21
 * * +38-093-999-66-33
 * * 7 123 456 789
 */
export const mobileRegex = /^(?=(?:\D*\d){9,15}\D*$)\+?[0-9]{1,3}[\s-]?[0-9]{1,5}[-\s]?[0-9][\d\s-]{5,11}?$/
export const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
export const amoutRegex = /^[\d ]*\.?([\d]{1,2})$/
export const emptyStringRegex = /^[ ]*$/

/**
 * Interface for validate forms NewCnt, NewTravelOrderItem...
 */
export interface iItem {
  key: string
  value?: any
  values?: any
}

/**
 * Returns TRUE if the input string is empty
 * @param str Input parameter - any string
 */
export const isEmpty = (str?: string) => str == null || !str.trim().length

/**
 *
 * @param _validation
 * @param key
 * @param label
 */
export const validPush = (_validation: any[], key: string, label: string) =>
  _validation.push({
    key: key,
    label: label
  })

/**
 * Coming soon
 * @param item
 * @param _validation
 * @param key
 * @param label
 */
export const validInputField = (
  item: any,
  _validation: any[],
  key: string,
  label: string
): void => {
  const inputField: iItem | null = item.find((it: iItem) => it.key === key)
  if (inputField != null && isEmpty(inputField.value))
    validPush(_validation, key, label)
}

/**
 * Coming soon
 * @param item
 * @param _validation
 * @param key
 * @param regex
 * @param regexLabel
 * @param label
 */
export const regexValidation = (
  item: any,
  _validation: any[],
  key: string,
  regex: RegExp,
  regexLabel: string,
  label: string
): void => {
  const inputField: iItem | null = item.find((it: iItem) => it.key === key)
  if (inputField != null && !isEmpty(inputField.value)) {
    if (!inputField.value.match(regex)) validPush(_validation, key, regexLabel)
  } else validPush(_validation, key, label)
}
