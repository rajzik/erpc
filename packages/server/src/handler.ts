import { Effect } from "effect";

import type {
  AnyProcedure,
  AnyRouter,
  ProcedureAtPath,
  ProcedurePath,
  RouterDef,
  RouterRecord,
} from "@erpc/core";

import type {
  CallProcedureOptions,
  CreateHttpHandlerOptions,
  ErpcRequest,
  ErpcResponse,
  HttpHandler,
  ProcedureResponse,
} from "./types.js";

const isRouter = (value: unknown): value is RouterDef<RouterRecord> => {
  return typeof value === "object" && value !== null && "_tag" in value && value._tag === "Router";
};

const isProcedure = (value: unknown): value is AnyProcedure => {
  return (
    typeof value === "object" && value !== null && "_tag" in value && value._tag === "Procedure"
  );
};

const findProcedure = <TRouter extends AnyRouter, TPath extends ProcedurePath<TRouter>>(
  router: TRouter,
  path: TPath,
): ProcedureAtPath<TRouter, TPath> => {
  let current: unknown = router;

  for (const segment of path.split(".")) {
    if (!isRouter(current)) {
      throw new Error(`Invalid ERPC path: ${path}`);
    }

    current = current.procedures[segment];
  }

  if (!isProcedure(current)) {
    throw new Error(`No procedure found for path: ${path}`);
  }

  return current as ProcedureAtPath<TRouter, TPath>;
};

export const callProcedure = async <
  TRouter extends AnyRouter,
  TPath extends ProcedurePath<TRouter>,
>(
  options: CallProcedureOptions<TRouter, TPath>,
): Promise<ProcedureResponse<TRouter, TPath>> => {
  const procedure = findProcedure(options.router, options.path);
  return Effect.runPromise(procedure.resolve(options.input, options.context));
};

const defaultHeaders = {
  "content-type": "application/json",
} as const;

export const createHttpHandler = <
  TRouter extends AnyRouter,
  TRequest extends ErpcRequest = ErpcRequest,
  TContext = {},
>(
  options: CreateHttpHandlerOptions<TRouter, TRequest, TContext>,
): HttpHandler<TRequest> => {
  return async (request) => {
    try {
      const context = await options.createContext(request);
      const data = await callProcedure({
        router: options.router,
        path: request.path as ProcedurePath<TRouter>,
        input: request.input as never,
        context: context as never,
      });

      return {
        status: 200,
        body: {
          ok: true,
          data,
        },
        headers: defaultHeaders,
      } satisfies ErpcResponse;
    } catch (error) {
      const formattedError = options.onError?.(error) ?? {
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown ERPC handler error.",
        cause: error,
      };

      return {
        status: 500,
        body: {
          ok: false,
          error: formattedError,
        },
        headers: defaultHeaders,
      } satisfies ErpcResponse;
    }
  };
};
