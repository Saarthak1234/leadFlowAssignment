import { cn } from "@/lib/utils"
import { Link } from "react-router"
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

export function LoginForm({
  className,
  onSubmit,
  formData,
  onChange,
  isLoading,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-sm mx-auto", className)} {...props}>
      <Card className="shadow-sm border border-slate-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-2 pt-4">
          <CardTitle className="text-xl font-semibold text-slate-900">Welcome back</CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Log in to your LeadFlow account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup className="-space-y-5">
              <Field>
                <FieldLabel htmlFor="email" className="text-sm font-medium text-slate-700">Email</FieldLabel>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  name="email" 
                  value={formData.email} 
                  onChange={onChange} 
                  className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel htmlFor="password" className="text-sm font-medium text-slate-700">Password</FieldLabel>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
                    Forgot your password?
                  </a>
                </div>
                <input 
                  id="password" 
                  type="password" 
                  required 
                  name="password" 
                  value={formData.password} 
                  onChange={onChange} 
                  className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                />
              </Field>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black text-white rounded-md py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
              
              <Field>
                <FieldDescription className="text-center mt-4 text-slate-500 text-sm">
                  Don&apos;t have an account? <Link to="/signup" className="text-black font-medium hover:underline">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-slate-400">
        By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a>{" "}
        and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
