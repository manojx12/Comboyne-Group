import Layout from './layouts/Layout';
import { routes } from './routes';

/** Renders one route inside the shared layout. Unknown paths render the 404 page. */
export default function App({ path }: { path: string }) {
  const { Page } = routes[path] ?? routes['/404'];
  return (
    <Layout path={path}>
      <Page />
    </Layout>
  );
}
