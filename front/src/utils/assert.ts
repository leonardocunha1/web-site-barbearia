export function assertNever(_value: never): never {
  throw new Error(`Tipo inesperado: ${_value}`);
}
