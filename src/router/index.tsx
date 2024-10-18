import type { RouteObject } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import DefaultLayout from '@/layout/default';
import HomePage from '@/pages/home';
import CalendarPage from '@/pages/calendar';
import AboutPage from '@/pages/about';
import NotFoundPage from '@/pages/other/404';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/calendar',
        element: <CalendarPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

function Router() {
  const element = useRoutes(routes);
  return <>{element}</>;
}

export default Router;
export { routes };
