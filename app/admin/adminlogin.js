"use client";

import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Handle session-based redirects
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.push("/Portal/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result && result.ok) {
      setEmail("");
      setPassword("");
      setIsLoading(false);
      const session = await getSession();
      const userRole = session.user.role;

      if (userRole === "admin") {
        router.push("/Portal/dashboard");
      } else {
        router.push("/");
      }
    } else {
      setEmail("");
      setPassword("");
      alert("Login failed. Please check your email and password");
    }
  }

  // If still loading, you might want to show a loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid justify-items-center bg-white shadow-lg rounded-lg p-8 m-6">
      <h1 className="text-2xl font-bold mb-12">Admin Login</h1>

      <form onSubmit={submitHandler}>
        {/* Email Input */}
        <div>
          <p htmlFor="email" className="text-base font-bold text-black mb-1">
            Email
          </p>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Password Input */}
        <div>
          <p htmlFor="password" className="text-base font-bold text-black mb-1">
            Password
          </p>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Display Error Message */}
        {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}

        {/* Login Button */}
        <button className="w-96 px-4 py-2 mt-5 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors">
          {isLoading ? "Login..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginForm;
