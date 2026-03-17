import type { AnyRouter } from "@erpc/core";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createMutationOptions, createQueryOptions } from "./options.js";
import type {
  CreateMutationOptionsInput,
  CreateQueryOptionsInput,
  ErpcMutationResult,
  ErpcQueryResult,
  MutationPath,
  QueryPath,
} from "./types.js";

export const useErpcQuery = <TRouter extends AnyRouter, TPath extends QueryPath<TRouter>>(
  options: CreateQueryOptionsInput<TRouter, TPath>,
): ErpcQueryResult<TRouter, TPath> => {
  return useQuery(createQueryOptions(options)) as ErpcQueryResult<TRouter, TPath>;
};

export const useErpcMutation = <TRouter extends AnyRouter, TPath extends MutationPath<TRouter>>(
  options: CreateMutationOptionsInput<TRouter, TPath>,
): ErpcMutationResult<TRouter, TPath> => {
  return useMutation(createMutationOptions(options)) as ErpcMutationResult<TRouter, TPath>;
};
