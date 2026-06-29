import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  createdAt: string;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  choice: 'weizen' | 'spreu';
  timestamp: string;
}

const PROFILE_KEY = 'user_profile';
const ENTRIES_KEY = 'daily_entries';

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveDailyEntry(entry: DailyEntry): Promise<void> {
  const entries = await loadAllEntries();
  const filtered = entries.filter((e) => e.date !== entry.date);
  filtered.push(entry);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
}

export async function loadAllEntries(): Promise<DailyEntry[]> {
  const data = await AsyncStorage.getItem(ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getTodayEntry(): Promise<DailyEntry | null> {
  const today = new Date().toISOString().split('T')[0];
  const entries = await loadAllEntries();
  return entries.find((e) => e.date === today) ?? null;
}

export function todayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
