import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";
import DashboardPage from "@/pages/DashboardPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import ProgramsPage from "@/pages/ProgramsPage";
import RegisterPage from "@/pages/RegisterPage";
import ScoreboardPage from "@/pages/ScoreboardPage";
import { getSession } from "@/utils/session";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Layout>
      <HomePage />
    </Layout>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Layout>
      <LoginPage />
    </Layout>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <Layout>
      <RegisterPage />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    if (!getSession()) throw redirect({ to: "/login" });
  },
  component: () => (
    <Layout>
      <DashboardPage />
    </Layout>
  ),
});

const programsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programs",
  beforeLoad: () => {
    if (!getSession()) throw redirect({ to: "/login" });
  },
  component: () => (
    <Layout>
      <ProgramsPage />
    </Layout>
  ),
});

const scoreboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scoreboard",
  beforeLoad: () => {
    if (!getSession()) throw redirect({ to: "/login" });
  },
  component: () => (
    <Layout>
      <ScoreboardPage />
    </Layout>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    const session = getSession();
    if (!session) throw redirect({ to: "/login" });
    if (session.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  component: () => (
    <Layout>
      <AdminPage />
    </Layout>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  programsRoute,
  scoreboardRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
