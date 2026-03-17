import type { ErpcRequest } from "./types.js";

export type CreateContext<TRequest extends ErpcRequest = ErpcRequest, TContext = {}> = (
  request: TRequest,
) => TContext | Promise<TContext>;

export interface RequestContext<TRequest extends ErpcRequest = ErpcRequest, TContext = {}> {
  readonly request: TRequest;
  readonly context: TContext;
}
