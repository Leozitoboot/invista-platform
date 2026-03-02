import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Landing from '../../modules/public/Landing';
import Catalog from '../../modules/public/Catalog';
import FundPage from '../../modules/public/FundPage';
import Login from '../../modules/auth/Login';
import Signup from '../../modules/auth/Signup';
import OnboardingPF from '../../modules/onboarding/OnboardingPF';
import OnboardingPJ from '../../modules/onboarding/OnboardingPJ';
import Suitability from '../../modules/suitability/Suitability';
import InvestStart from '../../modules/investment/InvestStart';
import Signature from '../../modules/investment/Signature';
import Dashboard from '../../modules/dashboard/Dashboard';
import FundPosition from '../../modules/dashboard/FundPosition';
import Analytics from '../../modules/dashboard/Analytics';
import DataRoom from '../../modules/dataroom/DataRoom';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/fundos" element={<Catalog />} />
        <Route path="/fundos/:slug" element={<FundPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* Protected */}
        <Route path="/investir/:slug" element={<ProtectedRoute><InvestStart /></ProtectedRoute>} />
        <Route path="/onboarding/pf" element={<ProtectedRoute><OnboardingPF /></ProtectedRoute>} />
        <Route path="/onboarding/pj" element={<ProtectedRoute><OnboardingPJ /></ProtectedRoute>} />
        <Route path="/suitability" element={<ProtectedRoute><Suitability /></ProtectedRoute>} />
        <Route path="/assinatura/:slug" element={<ProtectedRoute><Signature /></ProtectedRoute>} />
        <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/app/investimentos/:slug" element={<ProtectedRoute><FundPosition /></ProtectedRoute>} />
        <Route path="/data-room/:slug" element={<ProtectedRoute><DataRoom /></ProtectedRoute>} />
        <Route path="/app/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h1 className="text-4xl font-bold text-gray-300">404</h1>
            <p className="text-gray-500">Página não encontrada</p>
            <a href="/" className="text-primary-600 hover:underline">Voltar ao início</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
