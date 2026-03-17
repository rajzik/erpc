import type { AnyRouter, RpcEnvelope } from "@erpc/core";

import type { ClientError, ClientOptions, ErpcClient, MutationPath, QueryPath } from "./types.js";

class ErpcClientError extends Error implements ClientError {
  public readonly code: string;
  public readonly status?: number;
  public override readonly cause?: unknown;

  public constructor(
    message: string,
    code: string,
    options?: { cause?: unknown; status?: number },
  ) {
    super(message);
    this.name = "ErpcClientError";
    this.code = code;

    if (options?.status !== undefined) {
      this.status = options.status;
    }

    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

const unwrapEnvelope = async <TOutput>(
  promise: Promise<RpcEnvelope<TOutput>>,
): Promise<TOutput> => {
  const envelope = await promise;

  if (envelope.ok) {
    return envelope.data;
  }

  throw new ErpcClientError(envelope.error.message, envelope.error.code, {
    cause: envelope.error.cause,
  });
};

export const createClient = <TRouter extends AnyRouter>(
  options: ClientOptions,
): ErpcClient<TRouter> => {
  return {
    transport: options.transport,
    query: (path, input) =>
      unwrapEnvelope(
        options.transport.request({
          path: path as QueryPath<TRouter>,
          kind: "query",
          input,
        }),
      ),
    mutation: (path, input) =>
      unwrapEnvelope(
        options.transport.request({
          path: path as MutationPath<TRouter>,
          kind: "mutation",
          input,
        }),
      ),
  };
};
