import twilio from 'twilio'

export interface SMSProvider {
  sendOTP(phoneNumber: string, otp: string): Promise<void>
}

export class TwilioSMSService implements SMSProvider {
  private client: twilio.Twilio

  constructor(
    accountSid?: string,
    authToken?: string,
    private fromNumber?: string
  ) {
    this.client = twilio(
      accountSid || process.env.TWILIO_ACCOUNT_SID,
      authToken || process.env.TWILIO_AUTH_TOKEN
    )
    this.fromNumber = fromNumber || process.env.TWILIO_PHONE_NUMBER
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    if (!this.fromNumber) {
      throw new Error('Twilio phone number not configured')
    }

    try {
      await this.client.messages.create({
        body: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
        from: this.fromNumber,
        to: phoneNumber
      })
    } catch (error) {
      console.error('Failed to send SMS:', error)
      throw new Error('Failed to send verification code')
    }
  }
}

// Mock SMS service for development/testing
export class MockSMSService implements SMSProvider {
  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    console.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`)
    // In development, you might want to log the OTP or save it somewhere for testing
  }
}