import {Socket} from 'phoenix';
import {LiveSocket} from 'phoenix_live_view';
import {TypedHook} from '../src/typed-hook';
import {DefineHookType} from '../src/hook-type-definition';
import {HookCore} from '../src/hook-core';

// 1. Define hook types
type ClientSiderDef = DefineHookType<{
  el: HTMLElement;
  c2sEvents: {
    countUp: {payload: {}; reply: null};
    countOver10: {payload: {count: number}; reply: {actual: number}};
  };
  s2cEvents: {
    setCount: {payload: {count: number}};
  };
}>;

// 2. Define hook core
class ClientSiderCore implements HookCore<ClientSiderDef> {
  mounted(hook: TypedHook<ClientSiderDef>): void {
    // Call `hook.handleEvent` to take event from server
    // # https://hexdocs.pm/phoenix_live_view/js-interop.html#handling-server-pushed-events
    //
    // # How to push event from server:
    // def handle_info({:item_updated, item}, socket) do
    //   {:noreply, push_event(socket, "setCount", %{count: 10})}
    // end
    hook.handleEvent('setCount', payload => {
      console.log('Event "setCount" was pushed from server.', payload);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  destroyed(hook: TypedHook<ClientSiderDef>): void {}
}

// 3. Create hooks
const Hooks = {
  ClientSider: TypedHook.fromCore(new ClientSiderCore()),
};

// 4. Give hooks to LiveSocket in `assets/js/app.js`
const csrfToken = document!
  .querySelector("meta[name='csrf-token']")!
  .getAttribute('content');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const liveSocket = new LiveSocket('/live', Socket, {
  params: {_csrf_token: csrfToken},
  hooks: Hooks,
});

// 5. Use hooks at server
// ~H"""
// <div id="id-of-client-sider" phx-hook="ClientSider">
// """

// 6. Push event to server
TypedHook.pushEvent<ClientSiderDef, 'countOver10'>(
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
//   # or {:reply, %{...}, socket}
// end

// You can push event as promise
const f = async () => {
  const [reply, ref] = await TypedHook.pushEventPromise<
    ClientSiderDef,
    'countOver10'
  >(document!.getElementById('id-of-client-sider')!, 'countOver10', {
    count: 10,
  });
  console.log(`reply: ${JSON.stringify(reply)}`);
  console.log(`ref: ${ref}`);
};
f();
