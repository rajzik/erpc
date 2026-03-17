import type { Effect } from "effect";

export type ProcedureKind = "query" | "mutation";

export type ProcedureResolver<TInput, TOutput, TContext, TError> = (
  input: TInput,
  context: TContext,
) => Effect.Effect<TOutput, TError, never>;

interface ProcedureTypeMetadata<TInput, TOutput, TContext, TError> {
  readonly input: TInput;
  readonly output: TOutput;
  readonly context: TContext;
  readonly error: TError;
}

export interface ProcedureDef<
  TKind extends ProcedureKind = ProcedureKind,
  TInput = unknown,
  TOutput = unknown,
  TContext = unknown,
  TError = unknown,
> {
  readonly _tag: "Procedure";
  readonly kind: TKind;
  readonly resolve: ProcedureResolver<TInput, TOutput, TContext, TError>;
  readonly _types?: ProcedureTypeMetadata<TInput, TOutput, TContext, TError>;
}

export type AnyProcedure = ProcedureDef<any, any, any, any, any>;

export type RouterRecord = Record<string, AnyProcedure | RouterDef<any>>;

export interface RouterDef<TRecord extends RouterRecord = RouterRecord> {
  readonly _tag: "Router";
  readonly procedures: TRecord;
}

export type AnyRouter = RouterDef<any>;

export interface RpcErrorShape<TError = unknown> {
  readonly code: string;
  readonly message: string;
  readonly cause?: TError;
}

export interface RpcSuccessEnvelope<TData = unknown> {
  readonly ok: true;
  readonly data: TData;
}

export interface RpcErrorEnvelope<TError = unknown> {
  readonly ok: false;
  readonly error: RpcErrorShape<TError>;
}

export type RpcEnvelope<TData = unknown, TError = unknown> =
  | RpcSuccessEnvelope<TData>
  | RpcErrorEnvelope<TError>;

export type inferProcedureInput<TProcedure extends AnyProcedure> =
  TProcedure extends ProcedureDef<any, infer TInput, any, any, any> ? TInput : never;

export type inferProcedureOutput<TProcedure extends AnyProcedure> =
  TProcedure extends ProcedureDef<any, any, infer TOutput, any, any> ? TOutput : never;

export type inferProcedureContext<TProcedure extends AnyProcedure> =
  TProcedure extends ProcedureDef<any, any, any, infer TContext, any> ? TContext : never;

export type inferProcedureError<TProcedure extends AnyProcedure> =
  TProcedure extends ProcedureDef<any, any, any, any, infer TError> ? TError : never;

type RouterInputsForRecord<TRecord extends RouterRecord> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends AnyProcedure
    ? inferProcedureInput<TRecord[TKey]>
    : TRecord[TKey] extends RouterDef<infer TChild>
      ? RouterInputsForRecord<TChild>
      : never;
};

type RouterOutputsForRecord<TRecord extends RouterRecord> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends AnyProcedure
    ? inferProcedureOutput<TRecord[TKey]>
    : TRecord[TKey] extends RouterDef<infer TChild>
      ? RouterOutputsForRecord<TChild>
      : never;
};

export type inferRouterInputs<TRouter extends AnyRouter> = RouterInputsForRecord<
  TRouter["procedures"]
>;

export type inferRouterOutputs<TRouter extends AnyRouter> = RouterOutputsForRecord<
  TRouter["procedures"]
>;

type ProcedurePathsForRecord<TRecord extends RouterRecord> = {
  [TKey in Extract<keyof TRecord, string>]: TRecord[TKey] extends AnyProcedure
    ? TKey
    : TRecord[TKey] extends RouterDef<infer TChild>
      ? `${TKey}.${ProcedurePathsForRecord<TChild>}`
      : never;
}[Extract<keyof TRecord, string>];

type ProcedureAtRecordPath<
  TRecord extends RouterRecord,
  TPath extends string,
> = TPath extends `${infer THead}.${infer TTail}`
  ? THead extends keyof TRecord
    ? TRecord[THead] extends RouterDef<infer TChild>
      ? ProcedureAtRecordPath<TChild, TTail>
      : never
    : never
  : TPath extends keyof TRecord
    ? TRecord[TPath]
    : never;

export type ProcedurePath<TRouter extends AnyRouter> = ProcedurePathsForRecord<
  TRouter["procedures"]
>;

export type ProcedureAtPath<
  TRouter extends AnyRouter,
  TPath extends ProcedurePath<TRouter>,
> = Extract<ProcedureAtRecordPath<TRouter["procedures"], TPath>, AnyProcedure>;

export type ProcedurePathsByKind<TRouter extends AnyRouter, TKind extends ProcedureKind> = {
  [TPath in ProcedurePath<TRouter>]: ProcedureAtPath<TRouter, TPath> extends ProcedureDef<
    TKind,
    any,
    any,
    any,
    any
  >
    ? TPath
    : never;
}[ProcedurePath<TRouter>];
