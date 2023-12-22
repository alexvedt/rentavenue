import { Router, Route, RootRoute } from "@tanstack/react-router";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import ListingPage from "./pages/Listing";
import Root from "./App";

const rootRoute = new RootRoute({
  component: Root,
});

// NOTE: @see https://tanstack.com/router/v1/docs/guide/routes

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const myProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profiles/$profileId",
  component: ProfilePage,
});

const ListingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/listingitem/$listingId",
  component: ListingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  myProfileRoute,
  ListingRoute,
  registerRoute,
]);

export const router = new Router({ routeTree });

export default router;
