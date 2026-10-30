import { useCallback, useMemo, useState } from 'react';

export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validate(values), [validate, values]);

  const setFieldValue = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const markTouched = useCallback((field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  }, []);

  const validateAll = useCallback(() => {
    setTouched(Object.fromEntries(Object.keys(values).map((field) => [field, true])));
    return validate(values);
  }, [validate, values]);

  const handleChange = useCallback(
    (field) => (value) => setFieldValue(field, value),
    [setFieldValue]
  );

  const handleSubmit = useCallback((onValid, onInvalid) => () => {
    const nextErrors = validateAll();
    if (Object.keys(nextErrors).length > 0) return onInvalid?.(nextErrors);
    return onValid(values);
  }, [validateAll, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
  }, [initialValues]);

  const isComplete = useMemo(
    () => Object.values(values).every((value) => String(value ?? '').trim().length > 0),
    [values]
  );

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    setValues,
    setFieldValue,
    handleChange,
    handleSubmit,
    reset,
    touched,
    markTouched,
    errors,
    validateAll,
    isComplete,
    isValid,
  };
}
