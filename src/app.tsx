import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { MetaProvider } from '@solidjs/meta';
import { Suspense } from 'solid-js';
import { ToastProvider } from '~/components/shared/Toast';
import { NProgressBar } from '~/components/shared/NProgressBar';
import { SEO } from '~/components/shared/SEO';
import './app.css';

export default function App() {
  return (
    <MetaProvider>
      <ToastProvider>
        <SEO />
        <Router
          root={(props) => (
            <>
              <NProgressBar />
              <Suspense>{props.children}</Suspense>
            </>
          )}
        >
          <FileRoutes />
        </Router>
      </ToastProvider>
    </MetaProvider>
  );
}
