import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { loadProfile, saveDailyEntry, getTodayEntry, todayDateString, DailyEntry, UserProfile } from '../src/utils/storage';

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [weizenScale] = useState(new Animated.Value(1));
  const [spreuScale] = useState(new Animated.Value(1));

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
      getTodayEntry().then(setTodayEntry);
    }, [])
  );

  function animatePress(anim: Animated.Value, callback: () => void) {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.92, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true }),
    ]).start(callback);
  }

  async function handleChoice(choice: 'weizen' | 'spreu') {
    const entry: DailyEntry = {
      date: todayDateString(),
      choice,
      timestamp: new Date().toISOString(),
    };
    await saveDailyEntry(entry);
    setTodayEntry(entry);
  }

  function onWeizen() {
    animatePress(weizenScale, () => {
      if (todayEntry) {
        Alert.alert(
          'Bereits gewählt',
          `Du hast heute schon ${todayEntry.choice === 'weizen' ? '🌾 Weizen' : '💨 Spreu'} gewählt.\nMöchtest du deine Wahl ändern?`,
          [
            { text: 'Nein', style: 'cancel' },
            { text: 'Ja, ändern', onPress: () => handleChoice('weizen') },
          ]
        );
      } else {
        handleChoice('weizen');
      }
    });
  }

  function onSpreu() {
    animatePress(spreuScale, () => {
      if (todayEntry) {
        Alert.alert(
          'Bereits gewählt',
          `Du hast heute schon ${todayEntry.choice === 'weizen' ? '🌾 Weizen' : '💨 Spreu'} gewählt.\nMöchtest du deine Wahl ändern?`,
          [
            { text: 'Nein', style: 'cancel' },
            { text: 'Ja, ändern', onPress: () => handleChoice('spreu') },
          ]
        );
      } else {
        handleChoice('spreu');
      }
    });
  }

  const now = new Date();
  const dateLabel = `${WEEKDAYS[now.getDay()]}, ${now.getDate()}. ${now.toLocaleString('de-DE', { month: 'long' })}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hallo{profile ? `, ${profile.name}` : ''} 👋
        </Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.question}>Wer bist du heute?</Text>
        {todayEntry ? (
          <View style={[
            styles.chosenBadge,
            todayEntry.choice === 'weizen' ? styles.chosenWeizen : styles.chosenSpreu
          ]}>
            <Text style={styles.chosenBadgeText}>
              {todayEntry.choice === 'weizen' ? '🌾 Heute: Weizen' : '💨 Heute: Spreu'}
            </Text>
          </View>
        ) : (
          <Text style={styles.hint}>Tippe auf einen Knopf, um zu antworten</Text>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <Animated.View style={{ transform: [{ scale: weizenScale }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.choiceButton, styles.weizenButton,
              todayEntry?.choice === 'weizen' && styles.selectedButton]}
            onPress={onWeizen}
            activeOpacity={0.9}
          >
            <Text style={styles.choiceEmoji}>🌾</Text>
            <Text style={styles.choiceLabel}>Weizen</Text>
            <Text style={styles.choiceDesc}>Stark & wertvoll</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: spreuScale }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.choiceButton, styles.spreuButton,
              todayEntry?.choice === 'spreu' && styles.selectedButtonSpreu]}
            onPress={onSpreu}
            activeOpacity={0.9}
          >
            <Text style={styles.choiceEmoji}>💨</Text>
            <Text style={styles.choiceLabel}>Spreu</Text>
            <Text style={styles.choiceDesc}>Leicht & flüchtig</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/history')}>
        <Text style={styles.historyButtonText}>📊 Mein Verlauf</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    padding: 20,
    gap: 20,
  },
  header: { gap: 2 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#5C3A1E' },
  date: { fontSize: 14, color: '#8C6239' },
  questionBox: {
    backgroundColor: '#F5E6C8',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  question: { fontSize: 24, fontWeight: '800', color: '#5C3A1E', textAlign: 'center' },
  hint: { fontSize: 14, color: '#A07840', textAlign: 'center' },
  chosenBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  chosenWeizen: { backgroundColor: '#D4A017' },
  chosenSpreu: { backgroundColor: '#9E9E9E' },
  chosenBadgeText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  buttonsRow: { flexDirection: 'row', gap: 14 },
  choiceButton: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weizenButton: { backgroundColor: '#FFF3D0', borderWidth: 2, borderColor: '#D4A017' },
  spreuButton: { backgroundColor: '#F0F0F0', borderWidth: 2, borderColor: '#BDBDBD' },
  selectedButton: { backgroundColor: '#D4A017', borderColor: '#B8860B' },
  selectedButtonSpreu: { backgroundColor: '#9E9E9E', borderColor: '#757575' },
  choiceEmoji: { fontSize: 40 },
  choiceLabel: { fontSize: 20, fontWeight: '800', color: '#5C3A1E' },
  choiceDesc: { fontSize: 12, color: '#8C6239', textAlign: 'center' },
  historyButton: {
    backgroundColor: '#F5E6C8',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  historyButtonText: { fontSize: 16, fontWeight: '700', color: '#5C3A1E' },
});
