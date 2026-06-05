import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { NProgressBar } from "~/lib/client/nprogress";
import { AuthProvider } from "~/stores/auth";
import { ToastContainer } from "~/components/ui/Toast";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      <Router
        root={(props) => (
          <AuthProvider>
            <NProgressBar />
            <Suspense fallback={<div class="min-h-screen bg-[#F4F7FA]" />}>
              {props.children}
            </Suspense>
            <ToastContainer />
          </AuthProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
