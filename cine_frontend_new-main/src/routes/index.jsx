import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { BaseLayout } from '../layout/BaseLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { StudioRoute } from '../layout/StudioRoute';
import { AdminRoute } from '../layout/AdminRoute';

// Lazy load pages for performance
const Home = lazy(() => import('../pages/Home'));
const Explore = lazy(() => import('../pages/Explore'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const RegisterStudio = lazy(() => import('../pages/RegisterStudio'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const Streaming = lazy(() => import('../pages/Streaming'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Publicar = lazy(() => import('../pages/Publicar'));
const PublicarVideo = lazy(() => import('../pages/PublicarVideo'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/explorar',
        element: <Explore />,
      },
      {
        path: '/entrar',
        element: <Login />,
      },
      {
        path: '/registar',
        element: <Register />,
      },
      {
        path: '/registar-estudio',
        element: <RegisterStudio />,
      },
      {
        path: '/streaming/:contentId',
        element: <Streaming />,
      },
      {
        // General Protected Routes
        element: <ProtectedRoute />,
        children: [
          {
            path: '/perfil',
            element: <Profile />,
          },
          {
            path: '/painel',
            element: <Dashboard />,
          },
        ],
      },
      {
        // Studio Only Routes
        element: <StudioRoute />,
        children: [
          {
            path: '/painel/publicar',
            element: <Publicar />,
          },
          {
            path: '/painel/publicar/:contentId',
            element: <Publicar />,
          },
          {
            path: '/painel/publicar-video',
            element: <PublicarVideo />,
          },
          {
            path: '/painel/publicar-video/:contentId',
            element: <PublicarVideo />,
          },
        ],
      },
      {
        // Admin Only Routes
        element: <AdminRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboard />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
