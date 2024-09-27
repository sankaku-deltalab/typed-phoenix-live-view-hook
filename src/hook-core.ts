/* eslint-disable @typescript-eslint/no-namespace */
import {HookTypeDefinition} from './hook-type-definition';
import {TypedHook} from './typed-hook';

export interface HookCore<Def extends HookTypeDefinition> {
  mounted?: (hook: TypedHook<Def>) => void;
  beforeUpdate?: (hook: TypedHook<Def>) => void;
  updated?: (hook: TypedHook<Def>) => void;
  destroyed?: (hook: TypedHook<Def>) => void;
  disconnected?: (hook: TypedHook<Def>) => void;
  reconnected?: (hook: TypedHook<Def>) => void;
}

export namespace HookCore {
  export function toHook(
    core: HookCore<HookTypeDefinition>
  ): TypedHook<HookTypeDefinition> {
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
    } as unknown as TypedHook<HookTypeDefinition>;

    return hook;
  }
}
