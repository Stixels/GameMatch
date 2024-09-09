"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error === "Email not verified") {
          setError("Please verify your email address before logging in.");
        } else if (result.error === "User not found") {
          setError("No account found with this email address.");
        } else if (result.error.includes("Invalid login credentials")) {
          setError("Invalid email or password.");
        } else {
          setError("An error occurred during login. Please try again.");
        }
        console.error("Login failed:", result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error during login:", error);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-4">
            <div className="space-y-1.5">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button className="w-full mt-4" type="submit">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
