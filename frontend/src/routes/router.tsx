import AppLayout from '@/layouts/app-layout';
import CreatePowerCompany from '@/pages/create-power-company';
import CreatePowerPlant from '@/pages/create-power-plant';
import CreatePowerSubstation from '@/pages/create-power-substation';
import CreateTransformer from '@/pages/create-transformer';
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
      {
        path: '/create-power-plant',
        element: <CreatePowerPlant />,
      },
      {
        path: '/create-substation',
        element: <CreatePowerSubstation />,
      },
      {
        path: '/create-transformer',
        element: <CreateTransformer />,
      },
    ],
  },
]);
