import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router"
import { OTPForm } from "@/components/otp-form"
import { toast } from "sonner"

// Custom OTP Input Component (mimics react-verification-input)
const items = [
  { content: "Verify" },
]
const OTPInput = ({ length = 6, onChange, value }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""))
  const inputRefs = useRef([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    onChange(otp.join(""))
  }, [otp, onChange])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1].focus()
      }
      // Clear current input
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))])
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text")
    if (paste.length === length && /^\d+$/.test(paste)) {
      const pasteArray = paste.split("")
      setOtp(pasteArray)
      inputRefs.current[length - 1].focus()
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((data, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-750"
        />
      ))}
    </div>
  )
}

// ClickSpark component (simplified version)

const Verify = () => {
  const [otp, setOtp] = useState("")
  const [email] = useState(localStorage.getItem("userEmail"))
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length === 6) {
      setIsVerifying(true)
      try {
        const response = await fetch("http://localhost:5000/auth/verify", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        })
        const data = await response.json()
        
        if (response.ok && data.token) {
          toast.success("Successfully verified! Logging you in...")
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          navigate('/')
        } else {
          toast.error(data.message || "Verification failed")
        }
      } catch (error) {
        console.error("Error during OTP verification:", error)
        toast.error("Network error occurred. Please try again.")
      } finally {
        setIsVerifying(false)
      }
    } else {
      toast.error("Please enter a valid 6-digit OTP")
    }
  }

  const handleResendOTP = async () => {
    if (isResending || countdown > 0) return;

    setIsResending(true);

    try {
      const response = await fetch("http://localhost:5000/auth/resendotp", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
         throw new Error("Failed to resend");
      }

      toast.success("OTP resent successfully")
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error("Failed to resend OTP")
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center w-full p-4 font-sans">
      <OTPForm
        onSubmit={handleSubmit}
        onChange={setOtp}
        value={otp}
        email={email}
        isVerifying={isVerifying}
        isResending={isResending}
        countdown={countdown}
        onResend={handleResendOTP}
      />
    </div>
  )
}

export default Verify