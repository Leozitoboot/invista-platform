import { useState } from 'react';

type Errors<T> = Partial<Record<keyof T, string>>;
type TouchedFields<T> = Partial<Record<keyof T, boolean>>;

export function useFormState<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: (values: T) => Errors<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field] && validate) {
      const newErrors = validate({ ...values, [field]: value } as T);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const touch = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validate) {
      const newErrors = validate(values);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleSubmit = async (onSubmit: (values: T) => Promise<void>) => {
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
      const allTouched = Object.keys(values).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as TouchedFields<T>
      );
      setTouched(allTouched);
      if (Object.keys(newErrors).length > 0) return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, touched, isSubmitting, setValue, touch, handleSubmit };
}
