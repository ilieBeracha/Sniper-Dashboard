import { NextRequest, NextResponse } from 'next/server'
import { OTPStore } from '@/lib/otp-store'
import { formatPhoneNumber } from '@/lib/phone-validator'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)
    
    // Initialize OTP store
    const otpStore = new OTPStore()

    try {
      // Verify OTP
      const isValid = await otpStore.verify(formattedPhone, otp)
      
      if (isValid) {
        // Generate JWT token on successful verification
        const token = jwt.sign(
          { phoneNumber: formattedPhone },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        )
        
        return NextResponse.json({
          success: true,
          message: 'Phone number verified successfully',
          token,
          phoneNumber: formattedPhone
        })
      } else {
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        )
      }
    } finally {
      await otpStore.close()
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}