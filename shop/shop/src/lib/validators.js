const EMAIL = /^\S+@\S+\.\S+$/
export const USERNAME = /^[A-Za-z0-9_.]{3,20}$/ // matches the database rule

export function validateLogin({ identifier, password }) {
  const e = {}
  if (!identifier.trim()) e.identifier = 'Enter your email or username.'
  if (!password) e.password = 'Enter your password.'
  return e
}
export function validateRegister({ name, username, email, password, confirm }) {
  const e = {}
  if (!name.trim()) e.name = 'Enter your name.'
  if (!USERNAME.test(username.trim())) e.username = 'Use 3-20 letters, numbers, "_" or ".".'
  if (!EMAIL.test(email)) e.email = 'Enter a valid email address.'
  if (!password) e.password = 'Enter a password.'
  else if (password.length < 8) e.password = 'Use at least 8 characters.'
  if (confirm !== password) e.confirm = 'Passwords do not match.'
  return e
}
export function validateCheckout(s, payment, card) {
  const e = {}
  if (!s.firstName.trim()) e.firstName = 'Enter your first name.'
  if (!s.lastName.trim()) e.lastName = 'Enter your last name.'
  if (!EMAIL.test(s.email)) e.email = 'Enter a valid email address.'
  if (!/^\+?[0-9 -]{9,15}$/.test(s.phone.trim())) e.phone = 'Enter a valid phone number.'
  if (!s.address.trim()) e.address = 'Enter your address.'
  if (!s.city.trim()) e.city = 'Enter your city.'
  if (!s.province.trim()) e.province = 'Enter your province.'
  if (!/^[0-9]{5}$/.test(s.postalCode.trim())) e.postalCode = 'Postal code must be 5 digits.'
  if (payment === 'card') {
    if (!/^[0-9]{16}$/.test(card.number.replace(/\s/g, ''))) e.cardNumber = 'Enter a 16-digit card number.'
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(card.expiry)) e.cardExpiry = 'Use MM/YY.'
    if (!/^[0-9]{3,4}$/.test(card.cvc)) e.cardCvc = 'Enter 3 or 4 digits.'
  }
  return e
}
