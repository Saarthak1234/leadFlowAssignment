import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function OTPForm({
  className,
  onSubmit,
  onChange,
  value,
  email,
  isVerifying,
  isResending,
  countdown,
  onResend,
  ...props
}) {
  // Helper to determine if button should be disabled
  const isResendDisabled = isResending || countdown > 0;

  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-sm mx-auto", className)} {...props}>
      <Card className="shadow-sm border border-slate-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-2 pt-4">
          <CardTitle className="text-xl font-semibold text-slate-900">Enter verification code</CardTitle>
          <CardDescription className="text-sm text-slate-500">We sent a 6-digit code to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup className="space-y-2">
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP maxLength={6} id="otp" required value={value} onChange={onChange} pattern="^[0-9]+$">
                  <InputOTPGroup
                    className="flex w-full justify-center gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-slate-300 focus-within:*:data-[slot=input-otp-slot]:border-black">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center text-slate-500 text-sm mt-4">
                  Enter the 6-digit code sent to your email.
                </FieldDescription>
              </Field>

              <button
                type="submit"
                disabled={isVerifying || value.length !== 6}
                className="w-40 mx-auto block bg-black text-white rounded-md py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>

              <FieldDescription className="text-center flex items-center justify-center gap-1 mt-4 text-slate-500 text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={onResend}
                  disabled={isResendDisabled}
                  className={cn(
                    "text-black font-medium hover:underline p-0 bg-transparent border-none cursor-pointer",
                    isResendDisabled && "text-slate-400 hover:no-underline cursor-not-allowed"
                  )}
                >
                  {isResending
                    ? "Sending..."
                    : countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Resend"}
                </button>
              </FieldDescription>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}