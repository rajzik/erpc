import { describe, expect, it } from "vitest";

import { createRouter, procedure } from "@erpc/core";
import { createClient, type ClientRequest, type Transport } from "@erpc/client";
import type { RpcEnvelope } from "@erpc/core";
import {
  createMutationOptions,
  createQueryOptions,
  useErpcMutation,
  useErpcQuery,
} from "@erpc/query";

const router = createRouter({
  posts: createRouter({
    list: procedure.query<{ limit: number }, string[]>((_input) => null as never),
    create: procedure.mutation<{ title: string }, { id: string }>((_input) => null as never),
  }),
});

const transport: Transport = {
  request: async <TOutput, TPath extends string = string, TInput = unknown>(
    request: ClientRequest<TPath, TInput>,
  ) => {
    const { kind, input } = request;

    if (kind === "query") {
      return {
        ok: true,
        data: Array.from(
          { length: (input as { limit: number }).limit },
          (_, index) => `post-${index + 1}`,
        ),
      } as RpcEnvelope<TOutput>;
    }

    return {
      ok: true,
      data: {
        id: (input as { title: string }).title,
      },
    } as RpcEnvelope<TOutput>;
  },
};

const client = createClient<typeof router>({ transport });

describe("@erpc/query", () => {
  it("creates typed query and mutation options", () => {
    const query = createQueryOptions({
      client,
      path: "posts.list",
      input: { limit: 2 },
    });
    const mutation = createMutationOptions({
      client,
      path: "posts.create",
    });

    expect(query.queryKey).toEqual(["erpc", "query", "posts.list", { limit: 2 }]);
    expect(mutation.mutationKey).toEqual(["erpc", "mutation", "posts.create", undefined]);

    const runQuery = query.queryFn as () => Promise<string[]>;

    expect(runQuery).toBeTypeOf("function");
  });

  it("preserves hook result types", () => {
    const buildQueryResult = () =>
      useErpcQuery({
        client,
        path: "posts.list",
        input: { limit: 1 },
      });

    const buildMutationResult = () =>
      useErpcMutation({
        client,
        path: "posts.create",
      });

    type QueryResult = ReturnType<typeof buildQueryResult>;
    type MutationResult = ReturnType<typeof buildMutationResult>;

    const queryData = undefined as QueryResult["data"];
    const mutationAsync: MutationResult["mutateAsync"] = async () => ({ id: "post_1" });

    expect(queryData).toBeUndefined();
    expect(mutationAsync).toBeTypeOf("function");
  });
});
