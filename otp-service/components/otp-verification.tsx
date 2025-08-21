"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Phone, Shield, CheckCircle2 } from "lucide-react"

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

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
})

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
})

type PhoneFormData = z.infer<typeof phoneSchema>
type OTPFormData = z.infer<typeof otpSchema>

export function OTPVerification() {
  const [step, setStep] = React.useState<"phone" | "otp" | "success">("phone")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resendTimer, setResendTimer] = React.useState(0)
  const [debugOTP, setDebugOTP] = React.useState<string | null>(null)

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const onPhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)
    setError(null)
    setDebugOTP(null)

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: data.phoneNumber }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send OTP")
      }

      setPhoneNumber(data.phoneNumber)
      setStep("otp")
      setResendTimer(60)
      
      // Show OTP in development mode
      if (result.otp) {
        setDebugOTP(result.otp)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const onOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: data.otp }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to verify OTP")
      }

      setStep("success")
      
      // Store the token if needed
      if (result.token) {
        localStorage.setItem("authToken", result.token)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    await onPhoneSubmit({ phoneNumber })
  }

  const handleOTPChange = (value: string) => {
    otpForm.setValue("otp", value)
    setError(null)
  }

  const handleOTPComplete = async (value: string) => {
    await onOTPSubmit({ otp: value })
  }

  if (step === "success") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Verification Successful!</CardTitle>
          <CardDescription>
            Your phone number has been verified successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Phone number: {phoneNumber}
          </p>
          <Button
            onClick={() => {
              setStep("phone")
              phoneForm.reset()
              otpForm.reset()
              setError(null)
              setDebugOTP(null)
            }}
            variant="outline"
            className="w-full"
          >
            Verify Another Number
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {step === "phone" ? (
            <Phone className="h-6 w-6 text-primary" />
          ) : (
            <Shield className="h-6 w-6 text-primary" />
          )}
        </div>
        <CardTitle>
          {step === "phone" ? "Enter Your Phone Number" : "Verify Your Number"}
        </CardTitle>
        <CardDescription>
          {step === "phone"
            ? "We'll send you a verification code via SMS"
            : `Enter the 6-digit code sent to ${phoneNumber}`}
        </CardDescription>
      </CardHeader>

      {step === "phone" ? (
        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                {...phoneForm.register("phoneNumber")}
                disabled={isLoading}
              />
              {phoneForm.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {phoneForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center">
                <OTPInput
                  length={6}
                  onChange={handleOTPChange}
                  onComplete={handleOTPComplete}
                  disabled={isLoading}
                />
              </div>
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-red-500 text-center">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>
            
            {debugOTP && (
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  Development Mode: Your OTP is <strong>{debugOTP}</strong>
                </p>
              </div>
            )}
            
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || isLoading}
                className="text-sm"
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : "Resend code"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("phone")
                otpForm.reset()
                setError(null)
                setDebugOTP(null)
              }}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}