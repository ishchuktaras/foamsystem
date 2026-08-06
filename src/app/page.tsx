import { redirect } from "next/navigation";

export default function HomePage() {
  // Žádný rozcestník, posíláme uživatele rovnou na hlavní Přehled
  redirect("/admin");
}