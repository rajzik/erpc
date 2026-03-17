import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import {
  createRouter,
  procedure,
  type inferRouterInputs,
  type inferRouterOutputs,
} from "@erpc/core";

const router = createRouter({
  health: procedure.query<undefined, { ok: true }>(() => Effect.succeed({ ok: true as const })),
  post: createRouter({
    create: procedure.mutation<{ title: string }, { id: string }>((input) =>
      Effect.succeed({ id: input.title }),
    ),
  }),
});

describe("@erpc/core", () => {
  it("creates a router definition", () => {
    expect(router._tag).toBe("Router");
    expect(router.procedures.health.kind).toBe("query");
    expect(router.procedures.post.procedures.create.kind).toBe("mutation");
  });

  it("infers router inputs and outputs", () => {
    type RouterInputs = inferRouterInputs<typeof router>;
    type RouterOutputs = inferRouterOutputs<typeof router>;

    const inputShape: RouterInputs = {
      health: undefined,
      post: {
        create: {
          title: "draft",
        },
      },
    };
    const outputShape: RouterOutputs = {
      health: {
        ok: true,
      },
      post: {
        create: {
          id: "post_1",
        },
      },
    };

    expect(inputShape.post.create.title).toBe("draft");
    expect(outputShape.health.ok).toBe(true);
  });
});
