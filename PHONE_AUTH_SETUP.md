# Phone Authentication Setup with Vonage

This document explains how to configure phone authentication using Vonage SMS provider with Supabase.

## Prerequisites

1. A Vonage account with API credentials
2. Supabase project with SMS authentication enabled

## Configuration Steps

### 1. Supabase Configuration

Add the following configuration to your `supabase/config.toml` file:

```toml
[auth.sms]
# Allow/disallow new user signups via SMS to your project.
enable_signup = true
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = true
# Template for the SMS message. Use `.Code` to insert the OTP code.
template = "Your verification code is: .Code"
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Configure Vonage as the SMS provider
[auth.sms.vonage]
enabled = true
api_key = "env(VONAGE_API_KEY)"
api_secret = "env(VONAGE_API_SECRET)"
from = "env(VONAGE_FROM_NUMBER)"
```

### 2. Environment Variables

Add these environment variables to your `.env` file:

```env
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=your_vonage_phone_number
```

### 3. Supabase Dashboard Setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Phone provider
4. Select Vonage as the SMS provider
5. Enter your Vonage credentials

## Features Implemented

### Phone Authentication Component (`PhoneAuthForm.tsx`)

- **Beautiful UI** with modern design that adapts to light/dark themes
- **Country code selector** with popular countries
- **Phone number formatting** for better UX
- **OTP input** with auto-focus and auto-submit
- **Resend functionality** with countdown timer
- **Error handling** with clear user feedback
- **Loading states** with smooth animations

### Integration Points

1. **Auth Service** (`auth.ts`)
   - `sendPhoneOTP`: Sends verification code via SMS
   - `verifyPhoneOTP`: Verifies the entered OTP code

2. **Auth Store** (`authStore.ts`)
   - Phone number state management
   - OTP sending and verification methods
   - Session management after successful verification

3. **Login Form** (`MinimalLoginForm.tsx`)
   - Seamless integration with existing login methods
   - Phone option in the login method toggle
   - Smooth transitions between authentication methods

## Usage

Users can now:
1. Select "Phone" as their login method
2. Enter their phone number with country code
3. Receive a 6-digit verification code via SMS
4. Enter the code to authenticate
5. Resend the code if needed (after 60 seconds)

## Security Considerations

- OTP codes expire after a short period
- Rate limiting prevents SMS spam
- Phone numbers are verified before account access
- Session tokens are securely managed by Supabase

## Testing

To test phone authentication:
1. Ensure Vonage credentials are properly configured
2. Use a valid phone number that can receive SMS
3. Check Supabase logs for any SMS delivery issues
4. Monitor Vonage dashboard for SMS status

## Troubleshooting

If SMS messages are not being received:
1. Verify Vonage account has sufficient balance
2. Check if the phone number format is correct (with country code)
3. Ensure Vonage API credentials are valid
4. Check Supabase logs for any errors
5. Verify SMS provider is enabled in Supabase dashboard