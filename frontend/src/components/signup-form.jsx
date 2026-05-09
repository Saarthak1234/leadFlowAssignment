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
import { Link } from "react-router"

export function SignupForm({
  onSubmit,
  formData,
  onChange,
  className,
  isLoading,
  ...props
}) {
  return (
   <div className={cn("flex flex-col gap-4 w-full max-w-sm mx-auto", className)} {...props}>
     <Card className="shadow-sm border border-slate-200 bg-white rounded-xl">
      <CardHeader className="text-center pb-2 pt-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Create an account</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup className="-space-y-5">
            <Field>
              <FieldLabel htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</FieldLabel>
              <input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                name="name" 
                value={formData.name} 
                onChange={onChange}
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="username" className="text-sm font-medium text-slate-700">Username</FieldLabel>
              <input 
                id="username" 
                type="text" 
                placeholder="JohnDoe" 
                required 
                name="username" 
                value={formData.username} 
                onChange={onChange}
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              />
            </Field>
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
              <FieldLabel htmlFor="password" className="text-sm font-medium text-slate-700">Password</FieldLabel>
              <input 
                id="password" 
                type="password" 
                required 
                name="password" 
                value={formData.password} 
                onChange={onChange}
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors mb-1"
              />
              <FieldDescription className="text-xs text-slate-500">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</FieldLabel>
              <input 
                id="confirmPassword" 
                type="password" 
                required 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={onChange}
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              />
            </Field>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white rounded-md py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            
            <Field>
              <FieldDescription className="text-center mt-4 text-slate-500 text-sm">
                Already have an account? <Link to="/login" className="text-black font-medium hover:underline">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
   </div>
  );
}
