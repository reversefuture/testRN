import 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';

import { ThemeProvider } from '@/theme';
import ApplicationNavigator from '@/navigation/Application';

import '@/translations';

import { Pushy, PushyProvider,  } from "react-native-update";
import { Platform } from "react-native";
import _updateConfig from "../update.json";

const { appKey } = (_updateConfig as Record<string, {appKey:string}>)[Platform.OS];
// 唯一必填参数是appKey，其他选项请参阅 api 文档
const pushyClient = new Pushy({
  appKey,
  // 注意，默认情况下，在开发环境中不会检查更新
  // 如需在开发环境中调试更新，请设置debug为true
  // 但即便打开此选项，也仅能检查、下载热更，并不能实际应用热更。实际应用热更必须在release包中进行。
  // debug: true
});
 

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const storage = new MMKV();

function App() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <ApplicationNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

// 在根组件外加上PushyProvider后导出
export default function Root() {
  // 注意，在使用 PushyProvider 的当前组件中，无法直接调用 usePushy
  // 只有当前组件的子组件才能调用 usePushy
  return (
    <PushyProvider client={pushyClient}>
      {/* ↓ 整个应用的根组件放到PushyProvider中 */}
      <App />
    </PushyProvider>
  );
}

// export default App;
