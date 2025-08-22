# Phone Authentication Setup with Vonage

This document explains how to configure phone authentication using Vonage SMS provider with Supabase.

## Prerequisites

1. A Vonage account with API credentials
2. Supabase project with SMS authentication enabled

## Configuration Steps

### 1. Frontend Environment Configuration

Create a `.env` file in your project root (copy from `.env.example`):

```env
# Required for Supabase connection
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Other required variables
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_AUTH_BASE_URL=your-backend-url
```

**Note:** Vonage credentials are NOT stored in the frontend. They are configured in Supabase Dashboard only.

### 2. Supabase Dashboard Configuration

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Navigate to**: Authentication → Providers
4. **Find "Phone" in the providers list**
5. **Enable Phone Provider**: Toggle the switch to enable
6. **Configure Vonage**:
   - Provider: Select "Vonage" from the dropdown
   - API Key: Your Vonage API key
   - API Secret: Your Vonage API secret
   - From Number: Your Vonage phone number (with country code, e.g., +1234567890)
7. **Save the configuration**

### 3. Vonage Account Setup

If you don't have Vonage credentials yet:

1. **Sign up at**: https://dashboard.nexmo.com/sign-up
2. **Get your API credentials**:
   - API Key: Found in your Vonage dashboard
   - API Secret: Found in your Vonage dashboard
3. **Purchase a phone number**:
   - Go to Numbers → Buy Numbers
   - Select a number that supports SMS
   - This will be your "From Number"

### 4. Local Development with Supabase CLI (Optional)

If using Supabase CLI for local development, add to `supabase/config.toml`:

```toml
[auth.sms]
enable_signup = true
enable_confirmations = true
template = "Your verification code is: .Code"
max_frequency = "5s"

[auth.sms.vonage]
enabled = true
api_key = "env(VONAGE_API_KEY)"
api_secret = "env(VONAGE_API_SECRET)"
from = "env(VONAGE_FROM_NUMBER)"
```

Then set environment variables for local Supabase:
```bash
# In supabase/.env.local
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_FROM_NUMBER=your_phone_number
```

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

## Quick Setup Summary

1. **Frontend (.env file)**:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxx...
   ```

2. **Supabase Dashboard**:
   - Authentication → Providers → Phone → Enable
   - Select "Vonage" as provider
   - Enter Vonage API Key, API Secret, and From Number
   - Save

3. **That's it!** The phone authentication will now work.

## Troubleshooting

If SMS messages are not being received:
1. Verify Vonage account has sufficient balance
2. Check if the phone number format is correct (with country code)
3. Ensure Vonage API credentials are valid
4. Check Supabase logs for any errors
5. Verify SMS provider is enabled in Supabase dashboard

### Common Issues:

**"Failed to send verification code"**
- Check Vonage balance
- Verify From Number is in correct format (+1234567890)
- Ensure Vonage API credentials are correct in Supabase

**"Invalid phone number"**
- Israeli numbers must start with 05 (e.g., 050-123-4567)
- US numbers must be 10 digits (e.g., (555) 123-4567)

**"Phone provider is not enabled"**
- Go to Supabase Dashboard → Authentication → Providers
- Enable Phone provider
- Configure Vonage credentials