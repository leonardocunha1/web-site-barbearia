export interface UseCase<Req = unknown, Res = unknown> {
  execute(...args: Req extends unknown[] ? Req : [Req]): Promise<Res>;
}
