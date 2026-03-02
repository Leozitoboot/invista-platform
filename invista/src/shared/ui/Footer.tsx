import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-950 dark:bg-[#060e0c] text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#006856"/>
                <path d="M8 22L16 10L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.5 22L16 14.5L20.5 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
              <span className="text-white font-semibold text-lg">in<span className="font-bold">Vista</span></span>
            </div>
            <p className="text-sm">Gestão independente de investimentos imobiliários globais.</p>
            <p className="text-sm mt-2">
              <a href="mailto:ri@invista.me" className="hover:text-white transition-colors">ri@invista.me</a>
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">{t('nav.funds')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/fundos" className="hover:text-white transition-colors">Catálogo de Fundos</Link></li>
              <li><Link to="/auth/login" className="hover:text-white transition-colors">{t('nav.login')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">{t('footer.disclaimer_title')}</h3>
            <p className="text-xs leading-relaxed text-gray-300">
              Fundos de investimento não contam com garantia do administrador, do gestor, de qualquer mecanismo de seguro ou do Fundo Garantidor de Créditos (FGC). A rentabilidade obtida no passado não representa garantia de rentabilidade futura.
            </p>
          </div>
        </div>

        {/* Full disclaimer */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-300 leading-relaxed mb-4">
            Fundos de investimento não contam com garantia do administrador, do gestor, de qualquer mecanismo de seguro ou do Fundo Garantidor de Créditos (FGC). A rentabilidade obtida no passado não representa garantia de rentabilidade futura. A rentabilidade divulgada não é líquida de impostos. É recomendada a leitura cuidadosa do regulamento, prospecto, formulário de informações complementares e lâmina de informações essenciais antes de aplicar recursos. Os produtos e serviços mencionados podem não estar disponíveis em todas as jurisdições ou para determinadas categorias de investidores. As informações contidas neste site têm caráter meramente informativo e não constituem oferta ou recomendação de compra ou venda de cotas.
          </p>
          <p className="text-xs text-gray-300">
            inVista Real Estate — {t('footer.address')} — Brasil, 22640-040 | ri@invista.me
          </p>
        </div>
      </div>
    </footer>
  );
}
