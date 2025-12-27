import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GlobalBottomBar } from '../components/GlobalBottomBar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'fade',
        }}
      />
      <GlobalBottomBar />
    </>
  );
}

