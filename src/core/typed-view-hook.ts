import {LiveSocket} from 'phoenix_live_view';
import {
  C2SEventKey,
  C2SEventPayload,
  C2SEventReply,
  HookTypeDefinition,
} from '../typing/hook-type-definition';
import {TypedViewHook} from '../typing/typed-view-hook';
import {LiveSocketCanGetView} from '../typing/typed-live-socket';

export class TTypedViewHook {
  static createHookWithModifier<Def extends HookTypeDefinition>(
    mod: TypedViewHookModifier<Def>
  ): TypedViewHook<Def> {
    const filledMod = {
      ...this.createNopMod<Def>(),
      ...mod,
    };

    return {
      mounted(): void {
        filledMod.mounted(this);
      },
      beforeUpdate(): void {
        filledMod.beforeUpdate(this);
      },
      updated(): void {
        filledMod.updated(this);
      },
      destroyed(): void {
        filledMod.destroyed(this);
      },
      disconnected(): void {
        filledMod.disconnected(this);
      },
      reconnected(): void {
        filledMod.reconnected(this);
      },
    } as TypedViewHook<Def>;
  }

  private static createNopMod<Def extends HookTypeDefinition>() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    return {
      mounted(hook: TypedViewHook<Def>): void {},
      beforeUpdate(hook: TypedViewHook<Def>): void {},
      updated(hook: TypedViewHook<Def>): void {},
      destroyed(hook: TypedViewHook<Def>): void {},
      disconnected(hook: TypedViewHook<Def>): void {},
      reconnected(hook: TypedViewHook<Def>): void {},
    };
  }

  static pushEvent<
    Def extends HookTypeDefinition,
    Key extends C2SEventKey<Def>
  >(
    socket: LiveSocket,
    el: HTMLElement,
    key: Key,
    payload: C2SEventPayload<Def, Key>,
    callback?: (reply: C2SEventReply<Def, Key>, ref: number) => void
  ): void {
    const soc = socket as unknown as LiveSocketCanGetView;
    const view = soc.getViewByEl(el);
    if (view === undefined) throw new Error('Element is not in socket');
    const hook = view.getHook(el) as TypedViewHook<Def>;
    hook.pushEvent(key, payload, callback);
  }

  static async pushEventPromise<
    Def extends HookTypeDefinition,
    Key extends C2SEventKey<Def>
  >(
    socket: LiveSocket,
    el: HTMLElement,
    key: Key,
    payload: C2SEventPayload<Def, Key>
  ): Promise<[C2SEventReply<Def, Key>, number]> {
    return new Promise((resolve, reject) => {
      const callback = (reply: C2SEventReply<Def, Key>, ref: number): void => {
        resolve([reply, ref]);
      };

      try {
        this.pushEvent(socket, el, key, payload, callback);
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
