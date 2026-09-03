"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif mb-2">Sign In</h1>
          <p className="text-xs text-white/50 uppercase tracking-widest font-mono">
            Access your ROVE account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs text-center font-mono">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-mono">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141414] border border-white/20 p-4 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-mono">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141414] border border-white/20 p-4 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-white/50 font-mono">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#D4AF37] hover:underline">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
