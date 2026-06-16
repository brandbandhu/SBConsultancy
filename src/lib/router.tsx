import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  params?: Record<string, string>;
  activeOptions?: { exact?: boolean };
  activeProps?: { className?: string };
  inactiveProps?: { className?: string };
};

type RouterContextValue = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextValue>({
  path: "/",
  navigate: () => {},
});

function resolvePath(to: string, params?: Record<string, string>) {
  let path = to;
  Object.entries(params || {}).forEach(([key, value]) => {
    path = path.replace(`$${key}`, encodeURIComponent(value));
    path = path.replace(`:${key}`, encodeURIComponent(value));
  });
  return path;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo(
    () => ({
      path,
      navigate: (to: string) => {
        if (to === window.location.pathname) return;
        window.history.pushState(null, "", to);
        setPath(to);
        window.scrollTo({ top: 0, behavior: "instant" });
      },
    }),
    [path],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function usePath() {
  return useContext(RouterContext).path;
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return (target: string | { to: string }) => navigate(typeof target === "string" ? target : target.to);
}

export function Link({
  to,
  params,
  activeOptions,
  activeProps,
  inactiveProps,
  className,
  onClick,
  children,
  ...props
}: LinkProps) {
  const { path, navigate } = useContext(RouterContext);
  const href = resolvePath(to, params);
  const active = activeOptions?.exact ? path === href : path === href || (href !== "/" && path.startsWith(href));
  const stateClassName = active ? activeProps?.className : inactiveProps?.className;

  return (
    <a
      {...props}
      href={href}
      className={[className, stateClassName].filter(Boolean).join(" ")}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return;
        }
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
