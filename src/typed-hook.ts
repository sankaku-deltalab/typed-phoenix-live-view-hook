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
import {HookCore} from './hook-core';

/**
 * Base class for typed hook.
 * User must create instances via `TypedHook.fromCore`.
 *
 * @example
 *
 * ```ts
 * import {TypedHook, DefineHookType, HookCore} from 'typed-phoenix-live-view-hook';
 *
 * // 1. Define hook types
 * type ClientSiderDef = DefineHookType<...>;
 *
 * // 2. Define hook core
 * class ClientSiderCore implements HookCore<ClientSiderDef> {
 *   ...
 * }
 *
 * // 3. Create hooks
 * const Hooks = {
 *   ClientSider: TypedHook.fromCore(new ClientSiderCore()),
 * };
 * ```
 */
export class TypedHook<Def extends HookTypeDefinition> implements ViewHook {
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

  static fromCore<Def extends HookTypeDefinition>(
    core: HookCore<Def>
  ): TypedHook<Def> {
    // Create a hook as new Object
    // Because phoenix_live_view lib don't use functions of prototype.

    const hook = {
      mounted(): void {
        core.mounted && core.mounted(hook);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (hook.el as any)['__typed_view_hook'] = hook;
      },
      beforeUpdate(): void {
        core.beforeUpdate && core.beforeUpdate(hook);
      },
      updated(): void {
        core.updated && core.updated(hook);
      },
      destroyed(): void {
        core.updated && core.updated(hook);
      },
      disconnected(): void {
        core.disconnected && core.disconnected(hook);
      },
      reconnected(): void {
        core.reconnected && core.reconnected(hook);
      },
    } as unknown as TypedHook<Def>;

    return hook;
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
    const hook = (el as any)['__typed_view_hook'] as TypedHook<Def> | undefined;
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
