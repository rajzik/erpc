import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { createRouter, procedure } from "@erpc/core";
import { createClient, type ClientRequest, type Transport } from "@erpc/client";
import type { RpcEnvelope } from "@erpc/core";

const router = createRouter({
  posts: createRouter({
    list: procedure.query<{ limit: number }, string[]>((input) =>
      Effect.succeed(Array.from({ length: input.limit }, (_, index) => `post-${index + 1}`)),
    ),
    create: procedure.mutation<{ title: string }, { id: string }>((input) =>
      Effect.succeed({ id: input.title }),
    ),
  }),
});

const transport: Transport = {
  request: async <TOutput, TPath extends string = string, TInput = unknown>(
    request: ClientRequest<TPath, TInput>,
  ) => {
    const { path, kind, input } = request;

    if (kind === "query" && path === "posts.list") {
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

describe("@erpc/client", () => {
  it("creates a typed client", async () => {
    const client = createClient<typeof router>({ transport });

    await expect(client.query("posts.list", { limit: 2 })).resolves.toEqual(["post-1", "post-2"]);
    await expect(client.mutation("posts.create", { title: "hello" })).resolves.toEqual({
      id: "hello",
    });

    const promise = client.query("posts.list", { limit: 1 });
    const typedPromise: Promise<string[]> = promise;

    expect(typedPromise).toBeInstanceOf(Promise);
  });
});
