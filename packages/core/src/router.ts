import type { RouterDef, RouterRecord } from "./types.js";

export const createRouter = <const TRecord extends RouterRecord>(
  procedures: TRecord,
): RouterDef<TRecord> => ({
  _tag: "Router",
  procedures,
});
