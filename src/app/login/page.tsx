// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MessageCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Aktualizovaná zpráva pro WhatsApp s názvem systému Izolace RS
  const whatsappMessage = encodeURIComponent("Dobrý den, nemám přístupové údaje do systému Izolace RS (interní systém), nebo mám jiný problém s přístupem. Prosím o technickou podporu.");
  const whatsappUrl = `https://wa.me/420777596216?text=${whatsappMessage}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
    } catch (err) {
      console.error("Chyba při přihlášení:", err);
      setError("Došlo k neočekávané chybě připojení.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-[#FEFEFA] p-8 rounded-3xl shadow-xl border border-zinc-200">
        <div>
          <h2 className="text-center text-3xl font-black text-[#000000]">
            IZOLACE <span className="text-[#FF4F00]">RS</span>
          </h2>
          <p className="mt-2 text-center text-sm font-semibold text-zinc-500">
            Přihlášení do interní administrace
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-sm text-center font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3.5 py-3 border border-zinc-200 rounded-xl shadow-sm bg-zinc-50 text-[#000000] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4F00] sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">
                Heslo
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full px-3.5 py-3 pr-12 border border-zinc-200 rounded-xl shadow-sm bg-zinc-50 text-[#000000] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4F00] sm:text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-[#FF4F00] transition-colors cursor-pointer"
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
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-extrabold text-white bg-[#FF4F00] hover:bg-orange-600 focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Přihlásit se"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-500 mb-4 px-2 leading-relaxed">
            Nemáte přístupové údaje uživatele nebo máte jiný problém s přístupem?
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 w-full px-4 py-3.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-xl transition-colors border border-emerald-200 text-sm"
          >
            <MessageCircle size={18} className="text-emerald-600" />
            Neváhejte se obrátit na technickou podporu
          </a>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium">
            <span>Taras Ishchuk - OSVČ</span>
            <MessageCircle size={14} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}