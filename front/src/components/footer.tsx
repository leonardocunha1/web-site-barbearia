import { SocialButton } from "@/features/home/faq/SocialButton";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-white">El Bigodón</h2>
            <p className="text-sm text-gray-400">
              Sua barbearia de confiança em Franca - SP
            </p>
          </div>

          <div className="flex gap-4">
            <SocialButton
              href="https://wa.me/5516999999999"
              colorClass="bg-green-800 hover:bg-green-700"
              type="whatsapp"
            />
            <SocialButton
              href="https://instagram.com/sua_barbearia"
              colorClass="bg-blue-800 hover:bg-pink-700"
              type="instagram"
            />
          </div>
        </div>

        <div className="mt-6 border-t border-stone-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} El Bigodón. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
