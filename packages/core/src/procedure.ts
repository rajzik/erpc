import type { ProcedureDef, ProcedureKind, ProcedureResolver } from "./types.js";

const createProcedure = <TKind extends ProcedureKind>(kind: TKind) => {
  return <TInput, TOutput, TContext = unknown, TError = unknown>(
    resolve: ProcedureResolver<TInput, TOutput, TContext, TError>,
  ): ProcedureDef<TKind, TInput, TOutput, TContext, TError> => ({
    _tag: "Procedure",
    kind,
    resolve,
  });
};

export const query = createProcedure("query");
export const mutation = createProcedure("mutation");

export const procedure = {
  query,
  mutation,
} as const;
