import type { Transport, FetchTransportOptions } from "./types.js";

export const fetchTransport = (options: FetchTransportOptions): Transport => {
  const fetchImpl = options.fetch ?? globalThis.fetch;

  if (!fetchImpl) {
    throw new Error("No fetch implementation is available for fetchTransport.");
  }

  return {
    request: async ({ path, kind, input }) => {
      const response = await fetchImpl(options.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(options.headers ?? {}),
        },
        body: JSON.stringify({
          path,
          kind,
          input,
        }),
      });

      return response.json();
    },
  };
};
