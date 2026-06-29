import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { saveProfile } from '../src/utils/storage';

export default function SetupScreen() {
  const [name, setName] = useState('');

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Bitte gib deinen Namen ein.');
      return;
    }
    await saveProfile({ name: trimmed, createdAt: new Date().toISOString() });
    router.replace('/home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.heroContainer}>
          <Text style={styles.emoji}>🌾</Text>
          <Text style={styles.title}>Weizen{'\n'}oder Spreu?</Text>
          <Text style={styles.subtitle}>
            Jeden Tag eine Frage:{'\n'}Wer bist du heute?
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profil erstellen</Text>
          <Text style={styles.label}>Dein Name</Text>
          <TextInput
            style={styles.input}
            placeholder="z. B. Max"
            placeholderTextColor="#B0956A"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleCreate}
            returnKeyType="done"
            autoFocus
          />
          <TouchableOpacity style={styles.button} onPress={handleCreate} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Los geht's</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Du erhältst täglich um 14:00 Uhr eine Erinnerung.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5E6C8' },
  container: {
    flexGrow: 1,
    backgroundColor: '#F5E6C8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  heroContainer: { alignItems: 'center', gap: 8 },
  emoji: { fontSize: 64 },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#5C3A1E',
    textAlign: 'center',
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 16,
    color: '#8C6239',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFDF7',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#5C3A1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C3A1E',
    marginBottom: 4,
  },
  label: { fontSize: 14, color: '#8C6239', fontWeight: '600' },
  input: {
    borderWidth: 2,
    borderColor: '#D4A017',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#5C3A1E',
    backgroundColor: '#FFFDF7',
  },
  button: {
    backgroundColor: '#D4A017',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  hint: { fontSize: 13, color: '#A07840', textAlign: 'center' },
});
