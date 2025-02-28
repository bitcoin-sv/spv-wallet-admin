import {
  AnyRouter,
  RegisteredRouter,
  RouteById,
  RouteIds,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router';
import type { ConstrainLiteral, Expand } from '@tanstack/router-core';


export function useSearchParam<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
>(routeID: ConstrainLiteral<TFrom, RouteIds<TRouter['routeTree']>>, key: keyof Expand<RouteById<TRouter['routeTree'], TFrom>['types']['fullSearchSchema']>): [string, (value: string) => void] {
  const router = useRouter();
  const route = router.routeTree[routeID];

  const searchParams = useSearch({ from: route.id });
  const navigate = useNavigate({ from: route.fullPath });

  const setter = (value: string) => {
    navigate({
      // @ts-expect-error Keys are already validated
      search: (old) => ({
        ...old,
        [key]: value || undefined,
      }),
      replace: true,
    }).catch(console.error);
  };

  return [
    searchParams[key],
    setter,
  ];
}

