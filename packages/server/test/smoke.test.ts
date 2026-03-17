import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { createRouter, procedure } from "@erpc/core";
import {
  callProcedure,
  createHttpHandler,
  type CreateContext,
  type RequestContext,
} from "@erpc/server";

const router = createRouter({
  greeting: procedure.query<{ name: string }, { message: string }, { traceId: string }>(
    (input, context) =>
      Effect.succeed({
        message: `${context.traceId}:${input.name}`,
      }),
  ),
});

describe("@erpc/server", () => {
  it("calls a procedure and creates an HTTP handler", async () => {
    const result = await callProcedure({
      router,
      path: "greeting",
      input: { name: "Ada" },
      context: { traceId: "trace-1" },
    });

    expect(result).toEqual({ message: "trace-1:Ada" });

    const handler = createHttpHandler({
      router,
      createContext: async () => ({ traceId: "trace-2" }),
    });

    const response = await handler({
      path: "greeting",
      input: { name: "Grace" },
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      data: {
        message: "trace-2:Grace",
      },
    });
  });

  it("preserves context types", () => {
    type ContextFactory = CreateContext<{ path: string }, { traceId: string }>;
    type ContextShape = RequestContext<{ path: string }, { traceId: string }>["context"];

    const contextFactory: ContextFactory = async () => ({ traceId: "trace-3" });
    const contextShape: ContextShape = { traceId: "trace-4" };

    expect(contextFactory).toBeTypeOf("function");
    expect(contextShape.traceId).toBe("trace-4");
  });
});
