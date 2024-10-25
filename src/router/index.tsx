import { lazy,Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import DefaultLayout from '@/layout/default';
// import HomePage from '@/pages/home';
// import CalendarPage from '@/pages/calendar';
// import AboutPage from '@/pages/about';
// import NotFoundPage from '@/pages/other/404';
// import RGBToHexPage from '@/pages/color/rgb-to-hex';
// import ImageCompressPage from '@/pages/image/compress';
const HomePage = lazy(() => import('@/pages/home'));
const CalendarPage = lazy(() => import('@/pages/calendar'));
const AboutPage = lazy(() => import('@/pages/about'));
const RGBToHexPage = lazy(() => import('@/pages/color/rgb-to-hex'));
const ImageCompressPage = lazy(() => import('@/pages/image/compress'));
const NotFoundPage = lazy(() => import('@/pages/other/404'));

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
        path: '/color/rgb-to-hex',
        element: <RGBToHexPage />,
      },
      {
        path: '/image/compress',
        element: <ImageCompressPage />,
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
  return (
    <Suspense fallback={null}>
      {element}
    </Suspense>
  );
}

export default Router;
export { routes };
