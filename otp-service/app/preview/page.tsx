import { Phone, Shield, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OTPInput } from "@/components/ui/otp-input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">OTP Verification UI Flow</h1>
          <p className="text-muted-foreground">Here's what users see at each step of the verification process</p>
        </div>

        {/* Step 1: Phone Input */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Step 1: Enter Phone Number</h2>
          <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg border">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Enter Your Phone Number</CardTitle>
                <CardDescription>
                  We'll send you a verification code via SMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    defaultValue="+1 555 123 4567"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Send Verification Code
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Step 2: OTP Input */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Step 2: Enter Verification Code</h2>
          <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg border">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verify Your Number</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to +1 555 123 4567
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="1" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="2" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="3" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="" readOnly />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Development Mode: Your OTP is <strong>123456</strong>
                  </p>
                </div>
                
                <div className="text-center">
                  <Button type="button" variant="link" className="text-sm">
                    Resend code in 45s
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1">
                  Back
                </Button>
                <Button className="flex-1">
                  Verify
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Step 2.5: Loading State */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Loading State (During Verification)</h2>
          <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg border">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verify Your Number</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to +1 555 123 4567
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="1" disabled readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="2" disabled readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="3" disabled readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="4" disabled readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="5" disabled readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background" value="6" disabled readOnly />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="button" variant="outline" disabled className="flex-1">
                  Back
                </Button>
                <Button disabled className="flex-1">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Step 3: Success */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Step 3: Verification Success</h2>
          <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg border">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Verification Successful!</CardTitle>
                <CardDescription>
                  Your phone number has been verified successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Phone number: +1 555 123 4567
                </p>
                <Button variant="outline" className="w-full">
                  Verify Another Number
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error State */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Error State Example</h2>
          <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-lg border">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verify Your Number</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to +1 555 123 4567
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-red-500 bg-background" value="9" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-red-500 bg-background" value="9" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-red-500 bg-background" value="9" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-red-500 bg-background" value="9" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-red-500 bg-background" value="9" readOnly />
                      <input className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-red-500 bg-background" value="9" readOnly />
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Invalid OTP. Please try again.
                  </p>
                </div>
                
                <div className="text-center">
                  <Button type="button" variant="link" className="text-sm">
                    Resend code
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1">
                  Back
                </Button>
                <Button className="flex-1">
                  Verify
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}