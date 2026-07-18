import AppLayout from '@/layouts/app-layout';
import CreatePowerCompany from '@/pages/create-power-company';
import Dashboard from '@/pages/Dashboard';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/create-power-company',
        element: <CreatePowerCompany />,
      },
    ],
  },
]);
