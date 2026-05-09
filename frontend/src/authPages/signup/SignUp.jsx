"use client"
import { useState } from "react"
import { SignupForm } from "../../components/signup-form"
import { toast } from "sonner"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    return newErrors
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstError = Object.values(newErrors)[0]
      toast.error(firstError)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userName: formData.email.split('@')[0],
        }),
      })
      localStorage.setItem("userEmail", formData.email)
      const data = await response.json()

      if (response.ok) {
        toast.success("Account created! Please check your email for OTP.")
        window.location.href = "/verify"
      } else {
        toast.error(data.message || "Failed to create account")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error during signup:", error)
      toast.error("Network error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center w-full p-4 font-sans">
      <SignupForm 
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Signup