"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  length?: number
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ className, length = 6, onChange, onComplete, ...props }, ref) => {
    const [values, setValues] = React.useState<string[]>(Array(length).fill(''))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
      if (value.length > 1) {
        // Handle paste
        const pastedValues = value.slice(0, length).split('')
        const newValues = [...values]
        pastedValues.forEach((val, i) => {
          if (index + i < length) {
            newValues[index + i] = val
          }
        })
        setValues(newValues)
        const lastFilledIndex = Math.min(index + pastedValues.length - 1, length - 1)
        inputRefs.current[lastFilledIndex]?.focus()
        
        const otpValue = newValues.join('')
        onChange?.(otpValue)
        if (otpValue.length === length && !otpValue.includes('')) {
          onComplete?.(otpValue)
        }
        return
      }

      const newValues = [...values]
      newValues[index] = value

      setValues(newValues)
      
      const otpValue = newValues.join('')
      onChange?.(otpValue)

      // Move to next input
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // Check if complete
      if (otpValue.length === length && !otpValue.includes('')) {
        onComplete?.(otpValue)
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }

    const handleFocus = (index: number) => {
      inputRefs.current[index]?.select()
    }

    return (
      <div ref={ref} className={cn("flex gap-2", className)}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={values[index]}
            onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold rounded-md border border-input bg-background ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...props}
          />
        ))}
      </div>
    )
  }
)

OTPInput.displayName = "OTPInput"

export { OTPInput }