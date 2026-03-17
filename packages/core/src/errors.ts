export class ErpcNotImplementedError extends Error {
  public constructor(message = "ERPC runtime behavior is not implemented yet.") {
    super(message);
    this.name = "ErpcNotImplementedError";
  }
}
