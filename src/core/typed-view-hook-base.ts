import {
  El,
  S2CEventKey,
  S2CEventPayload,
  HookTypeDefinition,
  C2SEventKey,
  C2SEventPayload,
  C2SEventReply,
} from '../typing/hook-type-definition';
import {TypedViewHook} from '../typing/typed-view-hook';

export abstract class TypedViewHookBase<Def extends HookTypeDefinition>
  implements TypedViewHook<Def>
{
  readonly el!: El<Def>;
  readonly viewName!: string;
  readonly pushEvent!: <Key extends C2SEventKey<Def>>(
    event: Key,
    payload: C2SEventPayload<Def, Key>,
    callback?: (reply: C2SEventReply<Def, Key>, ref: number) => void
  ) => void;
  readonly pushEventTo!: <Key extends C2SEventKey<Def>>(
    selectorOrTarget: unknown,
    event: Key,
    payload: C2SEventPayload<Def, Key>,
    callback?: (reply: C2SEventReply<Def, Key>, ref: number) => void
  ) => void;
  readonly handleEvent!: <Key extends S2CEventKey<Def>>(
    event: Key,
    callback: (payload: S2CEventPayload<Def, Key>) => void
  ) => void;
  readonly upload!: (name: string, files: unknown) => void;
  readonly uploadTo!: (
    selectorOrTarget: unknown,
    name: string,
    files: unknown
  ) => void;

  mounted(): void {}
  beforeUpdate(): void {}
  updated(): void {}
  destroyed(): void {}
  disconnected(): void {}
  reconnected(): void {}

  static asHook(): Object {
    const obj = this.prototype as Object;
    const names = Object.getOwnPropertyNames(obj);
    const entries = names.map<[string, unknown]>(n => [
      n,
      (obj as Record<string, unknown>)[n],
    ]);
    return Object.fromEntries(entries);
  }
}
