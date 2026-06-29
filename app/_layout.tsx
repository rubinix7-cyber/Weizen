import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { loadProfile } from '../src/utils/storage';
import { requestPermissions, scheduleDailyNotification } from '../src/utils/notifications';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const profile = await loadProfile();
        const hasPermission = await requestPermissions();
        if (hasPermission) {
          await scheduleDailyNotification();
        }

        if (!profile) {
          router.replace('/setup');
        } else {
          router.replace('/home');
        }
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    }
    init();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#F5E6C8' },
          headerTintColor: '#5C3A1E',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#FFFDF7' },
        }}
      >
        <Stack.Screen name="setup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Weizen oder Spreu', headerBackVisible: false }} />
        <Stack.Screen name="history" options={{ title: 'Mein Verlauf' }} />
      </Stack>
    </>
  );
}
