import type {
  AnyRouter,
  ProcedureAtPath,
  ProcedurePath,
  RpcEnvelope,
  RpcErrorShape,
  inferProcedureContext,
  inferProcedureInput,
  inferProcedureOutput,
} from "@erpc/core";

import type { CreateContext } from "./context.js";

export interface ErpcRequest {
  readonly path: string;
  readonly input?: unknown;
  readonly method?: string;
  readonly headers?: Record<string, string>;
}

export interface ErpcResponse<TData = unknown, TError = unknown> {
  readonly status: number;
  readonly body: RpcEnvelope<TData, TError>;
  readonly headers: Record<string, string>;
}

export interface CallProcedureOptions<
  TRouter extends AnyRouter,
  TPath extends ProcedurePath<TRouter>,
> {
  readonly router: TRouter;
  readonly path: TPath;
  readonly input: inferProcedureInput<ProcedureAtPath<TRouter, TPath>>;
  readonly context: inferProcedureContext<ProcedureAtPath<TRouter, TPath>>;
}

export interface CreateHttpHandlerOptions<
  TRouter extends AnyRouter,
  TRequest extends ErpcRequest = ErpcRequest,
  TContext = {},
> {
  readonly router: TRouter;
  readonly createContext: CreateContext<TRequest, TContext>;
  readonly onError?: (error: unknown) => RpcErrorShape;
}

export type HttpHandler<TRequest extends ErpcRequest = ErpcRequest> = (
  request: TRequest,
) => Promise<ErpcResponse>;

export type ProcedureResponse<
  TRouter extends AnyRouter,
  TPath extends ProcedurePath<TRouter>,
> = inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>;
