import { useEffect, useState } from 'react'

const useCheckFormErrors = (data, rules) => {
  const [errors, setErrors] = useState(null)
  const [hasErrors, setHasErrors] = useState(false)
  const [isAnyFieldEmpty, setIsAnyFieldEmpty] = useState(false)
  const initialErrors = {}
  if (errors === null) {
    Object.keys(rules).forEach(fieldName => {
      initialErrors[fieldName] = {
        hasError: false,
        message: '',
      }
    })
  }

  useEffect(() => {
    const newErrors = {}
    let anyFieldEmpty = false
    let containsErrors = false
    Object.entries(rules).forEach(([fieldName, fieldRules]) => {
      newErrors[fieldName] = {
        hasError: false,
        message: '',
      }
      const fieldValue = data[fieldName]
      if (!fieldValue) {
        anyFieldEmpty = true
        return
      }

      fieldRules.forEach(rule => {
        const isEmpty = rule.checkEmpty ? rule.checkEmpty(fieldValue, data) : false
        if (isEmpty) {
          anyFieldEmpty = true
          return
        }
        const isValid = rule.validate ? rule.validate(fieldValue, data) : true
        if (!isValid) {
          containsErrors = true
          newErrors[fieldName].hasError = true
          newErrors[fieldName].message = rule.message
        }
      })
    })
    setErrors(newErrors)
    setIsAnyFieldEmpty(anyFieldEmpty)
    setHasErrors(containsErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(data)])
  return { errors: errors || initialErrors, isAnyFieldEmpty, hasErrors }
}

export { useCheckFormErrors }
