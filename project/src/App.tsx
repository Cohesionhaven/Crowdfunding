import { Provider } from 'react-redux';
import { ClerkProvider } from '@clerk/clerk-react';
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
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient();
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
                <motion.div
                  className="flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Header />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
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
                    </AnimatePresence>
                  </main>
                </motion.div>
                <Footer />
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  );
}

export default App;

