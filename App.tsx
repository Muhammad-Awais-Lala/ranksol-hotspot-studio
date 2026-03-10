import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './src/pages/Home'
import Templates from './src/pages/Templates'
import Studio from './src/pages/Studio'
import Login from './src/pages/Login'
import Register from './src/pages/Register'
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import { AuthProvider, useAuth } from './src/context/AuthContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated, loading } = useAuth();
  const { loading } = useAuth();
  const isAuthenticated = true;



  const location = useLocation();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout component to render Header/Footer only for protected routes
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

// Wrapper components to handle navigation props adaptation
const HomeWrapper = () => {
  const navigate = useNavigate();
  return <Home onSelectRoom={(slug) => navigate(`/templates?category=${slug}`)} />;
};

const TemplatesWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categorySlug = new URLSearchParams(location.search).get('category');

  if (!categorySlug) return <Navigate to="/" replace />;

  return (
    <Templates
      categorySlug={categorySlug}
      onSelectTemplate={(id) => navigate(`/studio?id=${id}`)}
      onBack={() => navigate('/')}
    />
  );
};

const StudioWrapper = () => {
  const navigate = useNavigate();
  //Studio reads ID from URL internally via window.location but we should probably fix that or let it stay if it works.
  //Studio.tsx:75 const urlParams = new URLSearchParams(window.location.search);
  //It works fine with react-router-dom as it updates the URL.

  // However, the Studio component takes an onBack prop.
  // Let's pass a handler that goes back.
  const handleBack = () => {
    // Basic back functionality, or go to templates if possible
    navigate(-1);
  }

  return <Studio onBack={handleBack} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HomeWrapper />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          <Route path="/templates" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <TemplatesWrapper />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          <Route path="/studio" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <StudioWrapper />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App