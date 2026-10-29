// Small compatibility layer so the page components can keep using the
// `<Link to>` / `navigate({ to })` style while running on react-router-dom.
import { forwardRef } from "react";
import {
  Link as RouterLink,
  NavLink,
  useLocation,
  useNavigate as useRouterNavigate,
} from "react-router-dom";
import { cn } from "@/lib/utils";

export const Link = forwardRef(function Link(
  { to, activeProps, activeOptions, className, ...rest },
  ref,
) {
  if (activeProps) {
    return (
      <NavLink
        ref={ref}
        to={to}
        end={activeOptions?.exact ?? false}
        className={({ isActive }) =>
          cn(className, isActive ? activeProps.className : undefined)
        }
        {...rest}
      />
    );
  }
  return <RouterLink ref={ref} to={to} className={className} {...rest} />;
});

export function useNavigate() {
  const navigate = useRouterNavigate();
  return (options) => {
    if (typeof options === "string") return navigate(options);
    const { to, replace } = options ?? {};
    return navigate(to, { replace: Boolean(replace) });
  };
}

export function useRouterState({ select } = {}) {
  const location = useLocation();
  const state = { location };
  return typeof select === "function" ? select(state) : state;
}

export { Outlet, useParams, useSearchParams } from "react-router-dom";
