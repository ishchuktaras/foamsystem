"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Voláme Auth.js signIn funkci pro poskytovatele "credentials"
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Chceme zachytit chybu a vypsat ji, ne automaticky přesměrovat
    });

    if (res?.error) {
      setError("Neplatný e-mail nebo heslo.");
      setLoading(false);
    } else {
      // Úspěch - pošleme tě do chráněné zóny
      router.push("/admin/materials");
      router.refresh(); // Vynutíme přehodnocení na straně serveru (aby proxy.ts zaregistroval sezení)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#0D1B3E]">
            FoamSystem
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Přihlášení do interní administrace
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-[#3B82F6] focus:border-[#3B82F6] sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-[#3B82F6] focus:border-[#3B82F6] sm:text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3B82F6] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] disabled:opacity-50 transition-colors"
            >
              {loading ? "Ověřuji..." : "Přihlásit se"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}