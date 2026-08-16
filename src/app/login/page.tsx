// src/app/login/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MessageCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Předvyplněná zpráva pro WhatsApp (technická podpora)
  const whatsappMessage = encodeURIComponent("Dobrý den, nemám přístupové údaje do systému FoamSystem, nebo mám jiný problém s přístupem. Prosím o technickou podporu.");
  const whatsappUrl = `https://wa.me/420777596216?text=${whatsappMessage}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Neplatný e-mail nebo heslo.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#000000]">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-[#FF4F00] focus:border-[#FF4F00] sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Heslo
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-[#FF4F00] focus:border-[#FF4F00] sm:text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#FF4F00] transition-colors"
                  title={showPassword ? "Skrýt heslo" : "Zobrazit heslo"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4F00] hover:bg-[#E64700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4F00] disabled:opacity-50 transition-colors"
            >
              {loading ? "Ověřuji..." : "Přihlásit se"}
            </button>
          </div>
        </form>

        {/* Sekce technické podpory a WhatsApp */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-4 px-2">
            Nemáte přístupové údaje uživatele nebo máte jiný problém s přístupem?
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 font-medium rounded-md transition-colors border border-emerald-100"
          >
            <MessageCircle size={20} />
            Neváhejte se obrátit na technickou podporu
          </a>

          {/* Patička s podpisem a WhatsApp ikonou */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Taras Ishchuk - OSVČ</span>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 inline-flex items-center"
              title="Kontaktovat podporu na WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}