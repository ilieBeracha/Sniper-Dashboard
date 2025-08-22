# Phone Authentication Troubleshooting Guide

## Phone Number Format

The phone number should be sent in international format:
- **Israeli numbers**: `972542967656` (972 + mobile number without leading 0)
  - User enters: `054-296-7656`
  - Sent to Supabase: `+972542967656`
  
- **US numbers**: `15551234567` (1 + area code + number)
  - User enters: `(555) 123-4567`
  - Sent to Supabase: `+15551234567`

## Common Issues and Solutions

### 1. "Phone provider is not enabled"
**Solution**: 
- Go to Supabase Dashboard → Authentication → Providers
- Enable Phone provider
- Make sure Vonage is selected and configured

### 2. "Invalid phone number"
**Check**:
- Phone number format is correct
- Israeli numbers start with 05
- US numbers are 10 digits
- The number is being formatted correctly (check browser console)

### 3. No SMS received
**Check in order**:

1. **Browser Console** (F12):
   - Look for: `Sending OTP to phone: +972542967656`
   - Check for any error messages

2. **Supabase Dashboard**:
   - Go to Authentication → Logs
   - Look for recent phone auth attempts
   - Check for any error messages

3. **Vonage Dashboard**:
   - Check your balance
   - Verify API credentials are correct
   - Check SMS logs for delivery status

4. **Supabase Configuration**:
   - Ensure Phone provider is enabled
   - Vonage is selected as SMS provider
   - API Key and Secret are correct
   - From Number is in correct format

### 4. "Failed to send verification code"
**Possible causes**:
- Vonage account has insufficient balance
- API credentials are incorrect
- From Number is not verified in Vonage
- Phone number is in a restricted country

## Debug Steps

1. **Open Browser Console** (F12)
2. **Try to send OTP**
3. **Look for these logs**:
   ```
   Sending OTP to phone: +972542967656
   OTP sent successfully: {user: null, session: null}
   ```

4. **If you see an error**, it will show the exact issue

## Test Phone Numbers

For testing, you can configure test phone numbers in Supabase:
1. Go to Authentication → Settings
2. Add test phone numbers with preset OTP codes
3. Use these for development without sending real SMS

## Need More Help?

1. Check Supabase Auth Logs for detailed error messages
2. Verify Vonage SMS logs to see if messages are being sent
3. Ensure your Vonage account is active and has credit
4. Check if your Vonage number can send to the destination country