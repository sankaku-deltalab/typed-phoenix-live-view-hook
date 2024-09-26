export type HookTypeDefinition = {
  el: HTMLElement;
  // client to server event
  c2sEvents: Record<
    string,
    {payload: Record<string, unknown>; reply: Record<string, unknown> | null}
  >;
  // server to client event
  s2cEvents: Record<string, {payload: Record<string, unknown>}>;
};

export type El<Cfg extends HookTypeDefinition> = Cfg['el'];

export type C2SEventKey<Cfg extends HookTypeDefinition> =
  keyof Cfg['c2sEvents'] & string;
export type C2SEventPayload<
  Cfg extends HookTypeDefinition,
  Key extends C2SEventKey<Cfg>
> = Cfg['c2sEvents'][Key]['payload'];
export type C2SEventReply<
  Cfg extends HookTypeDefinition,
  Key extends C2SEventKey<Cfg>
> = Cfg['c2sEvents'][Key]['reply'];

export type S2CEventKey<Cfg extends HookTypeDefinition> =
  keyof Cfg['s2cEvents'] & string;
export type S2CEventPayload<
  Cfg extends HookTypeDefinition,
  Key extends S2CEventKey<Cfg>
> = Cfg['s2cEvents'][Key]['payload'];

export type DefineHookType<T extends HookTypeDefinition> = T;
