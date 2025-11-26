import { Route as rootRoute } from "./routes/__root";
import { Route as IndexRoute } from "./routes/index";
import { Route as DashboardRoute } from "./routes/dashboard";
import { Route as ResultRoute } from "./routes/result";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      parentRoute: typeof rootRoute;
    };
    "/dashboard": {
      parentRoute: typeof rootRoute;
    };
    "/result": {
      parentRoute: typeof rootRoute;
    };
  }
}

const IndexRouteWithParent = IndexRoute.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as never);

const DashboardRouteWithParent = DashboardRoute.update({
  path: "/dashboard",
  getParentRoute: () => rootRoute,
} as never);

const ResultRouteWithParent = ResultRoute.update({
  path: "/result",
  getParentRoute: () => rootRoute,
} as never);

export const routeTree = rootRoute.addChildren([
  IndexRouteWithParent,
  DashboardRouteWithParent,
  ResultRouteWithParent,
]);

