import {Socket} from 'phoenix';
import {LiveSocket} from 'phoenix_live_view';
import {TypedViewHookModifier, TTypedViewHook} from '../core/typed-view-hook';
import {DefineHookType} from '../typing/hook-type-definition';
import {TypedViewHook} from '../typing/typed-view-hook';

// 1. Define hook types
type CSDef = DefineHookType<{
  el: HTMLElement;
  c2sEvents: {
    countUp: {payload: {}; reply: {}};
    countOver10: {payload: {count: number}; reply: {}};
  };
  s2cEvents: {
    setCount: {payload: {count: number}};
  };
}>;

// 2. Define hook modifiers
class ClientSider implements TypedViewHookModifier<CSDef> {
  mounted(hook: TypedViewHook<CSDef>): void {
    // # push event from server
    // # https://hexdocs.pm/phoenix_live_view/js-interop.html#handling-server-pushed-events
    // def handle_info({:item_updated, item}, socket) do
    //   {:noreply, push_event(socket, "setCount", %{count: 10})}
    // end
    // And take event at client
    hook.handleEvent('setCount', payload => {
      console.log('Event "setCount" was pushed from server.', payload);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  destroyed(hook: TypedViewHook<CSDef>): void {}
}

// 3. Create hooks
const Hooks = {
  ClientSider: TTypedViewHook.createHookWithModifier(new ClientSider()),
};

// 4. Give hooks to LiveSocket in `assets/js/app.js`
const csrfToken = document!
  .querySelector("meta[name='csrf-token']")!
  .getAttribute('content');
const liveSocket = new LiveSocket('/live', Socket, {
  params: {_csrf_token: csrfToken},
  hooks: Hooks,
});

// 5. Use hooks at server
// <div id="id-of-client-sider" phx-hook="ClientSider">

// 6. Push event to server
TTypedViewHook.pushEvent<CSDef, 'countOver10'>(
  liveSocket,
  document!.getElementById('id-of-client-sider')!,
  'countOver10',
  {count: 10},
  (reply, ref) => {
    console.log(`reply: ${JSON.stringify(reply)}`);
    console.log(`ref: ${ref}`);
  }
);
// # Handle client to server event at server
// def handle_event("countOver10", %{"count" => count}, socket) do
//   # do something
//   {:noreply, socket}
// end

// You can push event as promise
const f = async () => {
  const [reply, ref] = await TTypedViewHook.pushEventPromise<
    CSDef,
    'countOver10'
  >(
    liveSocket,
    document!.getElementById('id-of-client-sider')!,
    'countOver10',
    {count: 10}
  );
  console.log(`reply: ${JSON.stringify(reply)}`);
  console.log(`ref: ${ref}`);
};
f();
