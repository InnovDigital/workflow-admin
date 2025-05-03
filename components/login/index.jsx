"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GoFileDirectoryFill } from "react-icons/go";


// ...existing code...
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log("Login data:", data)
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10 border border-blue-200">
      {/* Logo */}
      <div className="flex items-center justify-center pt-6 gap-4">
        {/* Replace with <img src="/logo.png" alt="Wego Workflow" /> as needed */}
        <GoFileDirectoryFill size={30} className=' text-sky-700' />

        <h1 className="text-2xl font-bold  text-slate-950">Wego Workflow</h1>

      </div>
      <CardHeader>
        <CardTitle className=" text-slate-900">Sign In</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-900">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-900">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="login-form"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Login
