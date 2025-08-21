// Phone number validation utilities

export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Check if it's a valid length (10-15 digits for most international numbers)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false
  }
  
  // Basic validation - you can add more sophisticated validation based on your needs
  return true
}

export function formatPhoneNumber(phoneNumber: string, countryCode: string = '+1'): string {
  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '')
  
  // If the number doesn't start with a country code, add the default one
  if (!phoneNumber.startsWith('+')) {
    // For US numbers, check if it's 10 digits
    if (countryCode === '+1' && cleaned.length === 10) {
      cleaned = '1' + cleaned
    }
    return countryCode + cleaned
  }
  
  return '+' + cleaned
}

export function maskPhoneNumber(phoneNumber: string): string {
  // Show only last 4 digits
  const cleaned = phoneNumber.replace(/\D/g, '')
  if (cleaned.length < 4) {
    return phoneNumber
  }
  
  const lastFour = cleaned.slice(-4)
  const masked = '*'.repeat(cleaned.length - 4) + lastFour
  
  // Format with country code if present
  if (phoneNumber.startsWith('+')) {
    const countryCodeMatch = phoneNumber.match(/^\+\d{1,3}/)
    if (countryCodeMatch) {
      return countryCodeMatch[0] + ' ' + masked.slice(countryCodeMatch[0].length - 1)
    }
  }
  
  return masked
}