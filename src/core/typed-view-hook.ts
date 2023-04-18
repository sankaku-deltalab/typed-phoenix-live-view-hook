import {
  C2SEventKey,
  C2SEventPayload,
  C2SEventReply,
  HookTypeDefinition,
} from '../typing/hook-type-definition';
import {TypedViewHook} from '../typing/typed-view-hook';

export class TTypedViewHook {
  static createHookWithModifier<Def extends HookTypeDefinition>(
    mod: TypedViewHookModifier<Def>
  ): TypedViewHook<Def> {
    return {
      mounted(): void {
        mod.mounted && mod.mounted(this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.el as any)['__typed_view_hook'] = this;
      },
      beforeUpdate(): void {
        mod.beforeUpdate && mod.beforeUpdate(this);
      },
      updated(): void {
        mod.updated && mod.updated(this);
      },
      destroyed(): void {
        mod.updated && mod.updated(this);
      },
      disconnected(): void {
        mod.disconnected && mod.disconnected(this);
      },
      reconnected(): void {
        mod.reconnected && mod.reconnected(this);
      },
    } as TypedViewHook<Def>;
  }

  static pushEvent<
    Def extends HookTypeDefinition,
    Key extends C2SEventKey<Def>
  >(
    el: HTMLElement,
    key: Key,
    payload: C2SEventPayload<Def, Key>,
    callback?: (reply: C2SEventReply<Def, Key>, ref: number) => void
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hook = (el as any)['__typed_view_hook'] as
      | TypedViewHook<Def>
      | undefined;
    if (hook === undefined) throw new Error('Element is not has phy-hook');
    hook.pushEvent(key, payload, callback);
  }

  static async pushEventPromise<
    Def extends HookTypeDefinition,
    Key extends C2SEventKey<Def>
  >(
    el: HTMLElement,
    key: Key,
    payload: C2SEventPayload<Def, Key>
  ): Promise<[C2SEventReply<Def, Key>, number]> {
    return new Promise((resolve, reject) => {
      const callback = (reply: C2SEventReply<Def, Key>, ref: number): void => {
        resolve([reply, ref]);
      };

      try {
        this.pushEvent(el, key, payload, callback);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export interface TypedViewHookModifier<Def extends HookTypeDefinition> {
  mounted?: (hook: TypedViewHook<Def>) => void;
  beforeUpdate?: (hook: TypedViewHook<Def>) => void;
  updated?: (hook: TypedViewHook<Def>) => void;
  destroyed?: (hook: TypedViewHook<Def>) => void;
  disconnected?: (hook: TypedViewHook<Def>) => void;
  reconnected?: (hook: TypedViewHook<Def>) => void;
}
