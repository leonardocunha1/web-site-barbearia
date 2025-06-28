import { Accordion } from "@/components/ui/accordion";
import { FaqItem } from "./faq/FaqItem";
import { SocialButton } from "./faq/SocialButton";
import H2 from "@/components/ui/h2";
import H4 from "@/components/ui/h4";

export function Faq() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-12 text-center">
        <H4>
          Encontre respostas para as dúvidas mais comuns sobre nossos serviços.
        </H4>
        <H2>Perguntas Frequentes</H2>
      </div>

      <div className="overflow-hidden rounded-xl bg-stone-900 shadow-lg">
        <Accordion
          type="single"
          collapsible
          className="w-full divide-y divide-gray-200"
        >
          <FaqItem value="location" title="Onde estamos localizados?">
            <p className="text-gray-700">
              Estamos localizados na Rua Franca, 123 – Bairro Central, Franca -
              SP. Um espaço moderno e aconchegante para você cuidar do seu
              visual com estilo.
            </p>
            <div className="mt-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-principal-600 hover:text-principal-800 inline-flex items-center font-medium"
              >
                Ver no mapa
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </FaqItem>

          <FaqItem value="contact" title="Qual o contato?">
            <div className="space-y-3 text-gray-700">
              <p>
                Você pode falar com a gente pelo WhatsApp (16) 99999-9999 ou
                pelo Instagram @ElBigodon.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
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
          </FaqItem>

          <FaqItem value="differentials" title="O que oferemos de diferente?">
            <ul className="list-disc space-y-3 pl-5 text-gray-700">
              <li>Cortes e barba tradicionais com técnicas modernas</li>
              <li>Agendamento online para sua conveniência</li>
              <li>Bebidas artesanais selecionadas</li>
              <li>Ambiente totalmente climatizado</li>
              <li>Atendimento personalizado e exclusivo</li>
              <li>Produtos premium para cuidados masculinos</li>
            </ul>
            <p className="mt-4 font-medium text-gray-900">
              Cada cliente é tratado como VIP em nossa barbearia!
            </p>
          </FaqItem>
        </Accordion>
      </div>
    </section>
  );
}
