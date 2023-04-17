import type {View} from 'phoenix_live_view';

export interface LiveSocketCanGetView {
  getViewByEl(el: HTMLElement): View | undefined;
}
