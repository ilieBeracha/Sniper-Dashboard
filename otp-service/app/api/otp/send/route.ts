import { NextRequest, NextResponse } from 'next/server'
import { OTPStore } from '@/lib/otp-store'
import { TwilioSMSService, MockSMSService } from '@/lib/sms-service'
import { isValidPhoneNumber, formatPhoneNumber } from '@/lib/phone-validator'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)
    
    // Initialize OTP store
    const otpStore = new OTPStore()
    
    // Initialize SMS service (use MockSMSService if Twilio is not configured)
    const smsService = process.env.TWILIO_ACCOUNT_SID 
      ? new TwilioSMSService()
      : new MockSMSService()

    try {
      // Generate OTP
      const otp = await otpStore.create(formattedPhone)
      
      // Send OTP via SMS
      await smsService.sendOTP(formattedPhone, otp)
      
      // In development, also return the OTP (remove in production!)
      const response: any = {
        success: true,
        message: 'OTP sent successfully',
        phoneNumber: formattedPhone
      }
      
      if (process.env.NODE_ENV === 'development' && !process.env.TWILIO_ACCOUNT_SID) {
        response.otp = otp // Only for development without Twilio
      }
      
      return NextResponse.json(response)
    } finally {
      await otpStore.close()
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}