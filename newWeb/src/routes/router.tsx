import { lazy, Suspense, ReactElement, PropsWithChildren } from 'react';
import { Outlet, RouteObject, RouterProps, createBrowserRouter } from 'react-router-dom';

import PageLoader from 'components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import { rootPaths } from './paths';
import paths from './paths';

const App = lazy<() => ReactElement>(() => import('App'));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/main-layout'),
);
const AuthLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/auth-layout'),
);

const Dashboard = lazy<() => ReactElement>(() => import('pages/dashboard/Dashboard'));
const CustomerList = lazy<() => ReactElement>(() => import('pages/customers/CustomerList'));
const ManagerList = lazy<() => ReactElement>(() => import('pages/managers/ManagerList'));
const MechanicList = lazy<() => ReactElement>(() => import('pages/mechanics/MechanicList'));
const CarsList = lazy<() => ReactElement>(() => import('pages/cars/CarList'));
const InvoiceList = lazy<() => ReactElement>(() => import('pages/invoices/InvoiceList'));
const ServicesRequests = lazy<() => ReactElement>(() => import('pages/services/ServiceRequests'));
const TaskList = lazy<() => ReactElement>(() => import('pages/tasks/TaskList'));
const Login = lazy<() => ReactElement>(() => import('pages/authentication/Login'));
const SignUp = lazy<() => ReactElement>(() => import('pages/authentication/SignUp'));
const ErrorPage = lazy<() => ReactElement>(() => import('pages/error/ErrorPage'));
const CompanyReports = lazy<() => ReactElement>(() => import('pages/reports/CompanyReports'));

const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: paths.services,
            element:
              <ServicesRequests />,
          },
          {
            path: paths.customers,
            element:
              <CustomerList />,
          },
          {
            path: paths.managers,
            element:
              <ManagerList />,
          },
          {
            path: paths.mechanics,
            element:
              <MechanicList />,
          },
          {
            path: paths.tasks,
            element:
              <TaskList />,
          },
          {
            path: paths.cars,
            element:
              <CarsList />,
          },
          {
            path: paths.invoices,
            element:
              <InvoiceList />,
          },
          {
            path: paths.reports,
            element:
              <CompanyReports />,
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: paths.login,
            element: <Login />,
          },
          {
            path: paths.signup,
            element: <SignUp />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

const options: { basename: string } = {
  basename: '/autoworx',
};

const router: Partial<RouterProps> = createBrowserRouter(routes, options);

export default router;
