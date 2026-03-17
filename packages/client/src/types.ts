import type {
  AnyRouter,
  ProcedureAtPath,
  ProcedurePathsByKind,
  RpcEnvelope,
  inferProcedureInput,
  inferProcedureOutput,
} from "@erpc/core";

export interface ClientRequest<TPath extends string = string, TInput = unknown> {
  readonly path: TPath;
  readonly kind: "query" | "mutation";
  readonly input: TInput;
}

export interface Transport {
  request<TOutput, TPath extends string = string, TInput = unknown>(
    request: ClientRequest<TPath, TInput>,
  ): Promise<RpcEnvelope<TOutput>>;
}

export interface ClientOptions {
  readonly transport: Transport;
}

export interface ClientError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly cause?: unknown;
}

export interface FetchTransportOptions {
  readonly url: string;
  readonly fetch?: typeof globalThis.fetch;
  readonly headers?: HeadersInit;
}

export type QueryPath<TRouter extends AnyRouter> = ProcedurePathsByKind<TRouter, "query">;

export type MutationPath<TRouter extends AnyRouter> = ProcedurePathsByKind<TRouter, "mutation">;

export interface ErpcClient<TRouter extends AnyRouter> {
  readonly transport: Transport;
  query<TPath extends QueryPath<TRouter>>(
    path: TPath,
    input: inferProcedureInput<ProcedureAtPath<TRouter, TPath>>,
  ): Promise<inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>>;
  mutation<TPath extends MutationPath<TRouter>>(
    path: TPath,
    input: inferProcedureInput<ProcedureAtPath<TRouter, TPath>>,
  ): Promise<inferProcedureOutput<ProcedureAtPath<TRouter, TPath>>>;
}
