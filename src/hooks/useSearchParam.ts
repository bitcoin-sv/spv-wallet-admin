import {
  AnyRouter,
  RegisteredRouter,
  RouteById,
  RouteIds,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import type { ConstrainLiteral, Expand } from '@tanstack/router-core';


export function useSearchParam<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TSchema = Expand<RouteById<TRouter['routeTree'], TFrom>['types']['fullSearchSchema']>,
  const TKey extends keyof TSchema = keyof TSchema,
>(
  routeID: ConstrainLiteral<TFrom, RouteIds<TRouter['routeTree']>>,
  key: TKey,
): [TSchema[TKey], (value: TSchema[TKey]) => void] {
  const searchParams = useSearch({ from: routeID });
  const navigate = useNavigate<TRouter, TFrom>({ from: routeID });

  const setter = (value: TSchema[TKey]) => {
    // @ts-expect-error It's a generic component, no need to have types for the search object
    navigate({
      search: (old) => ({
        ...old,
        [key]: value ?? undefined,
      }),
      replace: true,
    }).catch(console.error);
  };

  return [
    searchParams[key],
    setter,
  ];
}

