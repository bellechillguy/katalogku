export function validateProfile(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Please enter your full name.';

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  const phoneDigits = values.phone.replace(/\D/g, '');
  if (!phoneDigits) {
    errors.phone = 'Please enter your phone number.';
  } else if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = 'Enter a phone number with 8–15 digits.';
  }

  return errors;
}
