import { Redirect } from 'expo-router';

// Handled by _layout.tsx — this file keeps expo-router happy
export default function Index() {
  return <Redirect href="/home" />;
}
