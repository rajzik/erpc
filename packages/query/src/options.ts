import type {
  AnyRouter,
  ProcedureAtPath,
  inferProcedureInput,
  inferProcedureOutput,
} from "@erpc/core";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type {
  CreateMutationOptionsInput,
  CreateQueryOptionsInput,
  MutationPath,
  QueryKeyFactory,
  QueryPath,
} from "./types.js";

const defaultKeyFactory: QueryKeyFactory = (kind, path, input) => ["erpc", kind, path, input];

export const createQueryOptions = <TRouter extends AnyRouter, TPath extends QueryPath<TRouter>>({
  client,
  path,
  input,
  enabled,
  keyFactory = defaultKeyFactory,
}: CreateQueryOptionsInput<TRouter, TPath>) => {
  type TOutput = inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>;

  return queryOptions<TOutput, Error>({
    queryKey: keyFactory("query", path, input),
    queryFn: () => client.query(path, input),
    ...(enabled === undefined ? {} : { enabled }),
  });
};

export const createMutationOptions = <
  TRouter extends AnyRouter,
  TPath extends MutationPath<TRouter>,
>({
  client,
  path,
  keyFactory = defaultKeyFactory,
}: CreateMutationOptionsInput<TRouter, TPath>) => {
  type TInput = inferProcedureInput<ProcedureAtPath<TRouter, TPath>>;
  type TOutput = inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>;

  return mutationOptions<TOutput, Error, TInput>({
    mutationKey: keyFactory("mutation", path, undefined),
    mutationFn: (input: TInput) => client.mutation(path, input),
  });
};
