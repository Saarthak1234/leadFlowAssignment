"use client"
import { useState } from "react"
import { LoginForm } from "../../components/login-form"
import { toast } from "sonner"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      
      if (response.ok && data.token) {
        toast.success("Login successful!")
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        window.location.href = "/" // redirect to dashboard
      } else if (response.status === 404) {
        // User not found, redirect to signup
        toast.error("Account not found. Redirecting to sign up...")
        window.location.href = "/signup"
      } else {
        // Handle login error here if needed
        toast.error(data.message || "Login failed")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error during login:", error)
      toast.error("Network error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center w-full p-4 font-sans">
      <LoginForm
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        isLoading={isLoading} 
      />
    </div>
  )
}

export default Login