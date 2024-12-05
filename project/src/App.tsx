import { Provider } from 'react-redux';
import { ClerkProvider, useClerk } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from './store/store';
import { Header } from './components/layout/Header';
import { CampaignList } from './components/campaigns/CampaignList';
import { CampaignDetails } from './components/campaigns/CampaignDetails';
import { CreateCampaign } from './components/campaigns/CreateCampaign';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Footer } from './components/layout/Footer';

const queryClient = new QueryClient();

function App() {
  const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error('Missing Clerk Publishable Key');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: Missing Clerk Configuration</p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<CampaignList />} />
                  <Route path="/sign-in/*" element={<SignIn />} />
                  <Route path="/sign-up/*" element={<SignUp />} />
                  <Route path="/campaign/:id" element={<CampaignDetails />} />
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute>
                        <CreateCampaign />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  );
}

export default App;
