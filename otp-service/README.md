# OTP Verification Service

A beautiful and secure OTP (One-Time Password) verification service built with Next.js, shadcn/ui, and Redis. This template provides a complete solution for phone number verification via SMS.

## Features

- 🔐 **Secure OTP Generation**: 6-digit OTP codes with configurable expiration
- 📱 **SMS Integration**: Twilio integration for sending SMS (with mock service for development)
- 🎨 **Beautiful UI**: Modern, responsive interface built with shadcn/ui
- 🚀 **Redis Storage**: Fast and reliable OTP storage with automatic expiration
- 🛡️ **Rate Limiting**: Prevents abuse with built-in rate limiting
- 🔑 **JWT Authentication**: Generates JWT tokens on successful verification
- ♿ **Accessible**: Fully keyboard navigable and screen reader friendly

## Prerequisites

- Node.js 18+ 
- Redis server (local or cloud)
- Twilio account (optional, for SMS sending)

## Installation

1. Clone the repository and install dependencies:

```bash
cd otp-service
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# JWT Secret
JWT_SECRET=your-secret-key-change-this
```

4. Start Redis (if running locally):

```bash
redis-server
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### API Endpoints

#### Send OTP
```bash
POST /api/otp/send
Content-Type: application/json

{
  "phoneNumber": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "+1234567890",
  "otp": "123456" // Only in development mode without Twilio
}
```

#### Verify OTP
```bash
POST /api/otp/verify
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "token": "jwt_token_here",
  "phoneNumber": "+1234567890"
}
```

### Frontend Integration

The main component is `OTPVerification` which handles the complete flow:

```tsx
import { OTPVerification } from "@/components/otp-verification"

export default function Page() {
  return <OTPVerification />
}
```

## Configuration

### OTP Settings

You can customize OTP settings in `lib/otp-store.ts`:

- `OTP_TTL`: OTP expiration time (default: 300 seconds)
- `MAX_ATTEMPTS`: Maximum verification attempts (default: 3)
- OTP length: Change in `generateOTP()` method

### SMS Provider

The service supports multiple SMS providers. Currently implemented:
- Twilio (production)
- Mock service (development)

To add a new provider, implement the `SMSProvider` interface in `lib/sms-service.ts`.

## Security Considerations

- **Rate Limiting**: 60-second cooldown between OTP requests
- **Attempt Limiting**: Maximum 3 verification attempts per OTP
- **Auto Expiration**: OTPs expire after 5 minutes
- **Phone Validation**: Basic phone number validation included
- **JWT Tokens**: Secure token generation for authenticated sessions

## Development

In development mode without Twilio configured:
- OTPs are logged to console
- OTPs are displayed in the UI for testing
- Mock SMS service is used automatically

## Production Deployment

1. Set up a production Redis instance (e.g., Redis Cloud, AWS ElastiCache)
2. Configure Twilio credentials for SMS sending
3. Use strong JWT secret
4. Set `NODE_ENV=production`
5. Deploy to your preferred platform (Vercel, AWS, etc.)

## Customization

### Styling

The UI uses shadcn/ui components with Tailwind CSS. Customize the theme in:
- `tailwind.config.ts`: Tailwind configuration
- `app/globals.css`: CSS variables and global styles
- Component files in `components/ui/`: Individual component styles

### OTP Format

Modify the OTP generation in `lib/otp-store.ts`:
- Change length
- Use alphanumeric codes
- Add custom formatting

## License

MIT License - feel free to use this template for your projects!