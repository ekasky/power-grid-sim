import AppLayout from '@/layouts/app-layout';
import CreatePowerCompany from '@/pages/create-power-company';
import CreatePowerPlant from '@/pages/create-power-plant';
import CreatePowerSubstation from '@/pages/create-power-substation';
import CreateTransformer from '@/pages/create-transformer';
import { Customers } from '@/pages/customers';
import Dashboard from '@/pages/Dashboard';
import PowerCompanies from '@/pages/power-companies';
import PowerPlants from '@/pages/power-plants';
import Substations from '@/pages/substations';
import Transformers from '@/pages/transformers';
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
      {
        path: '/power-companies',
        element: <PowerCompanies />,
      },
      {
        path: '/power-plants',
        element: <PowerPlants />,
      },
      {
        path: '/substations',
        element: <Substations />,
      },
      {
        path: '/transformers',
        element: <Transformers />,
      },
      {
        path: '/customers',
        element: <Customers />,
      },
    ],
  },
]);
