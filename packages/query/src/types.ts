import type {
  AnyRouter,
  ProcedureAtPath,
  ProcedurePathsByKind,
  inferProcedureInput,
  inferProcedureOutput,
} from "@erpc/core";
import type { ErpcClient } from "@erpc/client";
import type { QueryKey, UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export type QueryKeyFactory = (
  kind: "query" | "mutation",
  path: string,
  input: unknown,
) => QueryKey;

export interface ErpcQueryClient<TRouter extends AnyRouter> {
  readonly client: ErpcClient<TRouter>;
  readonly keyFactory?: QueryKeyFactory;
}

export type QueryPath<TRouter extends AnyRouter> = ProcedurePathsByKind<TRouter, "query">;

export type MutationPath<TRouter extends AnyRouter> = ProcedurePathsByKind<TRouter, "mutation">;

export interface CreateQueryOptionsInput<
  TRouter extends AnyRouter,
  TPath extends QueryPath<TRouter>,
> extends ErpcQueryClient<TRouter> {
  readonly path: TPath;
  readonly input: inferProcedureInput<ProcedureAtPath<TRouter, TPath>>;
  readonly enabled?: boolean;
}

export interface CreateMutationOptionsInput<
  TRouter extends AnyRouter,
  TPath extends MutationPath<TRouter>,
> extends ErpcQueryClient<TRouter> {
  readonly path: TPath;
}

export type ErpcQueryResult<
  TRouter extends AnyRouter,
  TPath extends QueryPath<TRouter>,
> = UseQueryResult<inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>, Error>;

export type ErpcMutationResult<
  TRouter extends AnyRouter,
  TPath extends MutationPath<TRouter>,
> = UseMutationResult<
  inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>,
  Error,
  inferProcedureInput<ProcedureAtPath<TRouter, TPath>>
>;
