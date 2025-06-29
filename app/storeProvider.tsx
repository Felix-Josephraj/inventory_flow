// app/storeProvider.js
'use client';

import { store } from '../store';
import { Provider } from 'react-redux';

export function StoreProvider({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
  return <Provider store={store}>{children}</Provider>;
}
