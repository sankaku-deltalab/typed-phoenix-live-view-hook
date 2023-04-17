import type {ViewHook} from 'phoenix_live_view';

import {
  El,
  S2CEventKey,
  S2CEventPayload,
  HookTypeDefinition,
  C2SEventKey,
  C2SEventPayload,
  C2SEventReply,
} from './hook-type-definition';

export interface TypedViewHook<Def extends HookTypeDefinition>
  extends ViewHook {
  readonly el: El<Def>;
  readonly viewName: string;
  readonly pushEvent: <Key extends C2SEventKey<Def>>(
    event: Key,
    payload: C2SEventPayload<Def, Key>,
    callback?: (reply: C2SEventReply<Def, Key>, ref: number) => void
  ) => void;
  readonly pushEventTo: <Key extends C2SEventKey<Def>>(
    selectorOrTarget: unknown,
    event: Key,
    payload: C2SEventPayload<Def, Key>,
    callback?: (reply: C2SEventReply<Def, Key>, ref: number) => void
  ) => void;
  readonly handleEvent: <Key extends S2CEventKey<Def>>(
    event: Key,
    callback: (payload: S2CEventPayload<Def, Key>) => void
  ) => void;
  readonly upload: (name: string, files: unknown) => void;
  readonly uploadTo: (
    selectorOrTarget: unknown,
    name: string,
    files: unknown
  ) => void;

  mounted(): void;
  beforeUpdate(): void;
  updated(): void;
  destroyed(): void;
  disconnected(): void;
  reconnected(): void;
}
