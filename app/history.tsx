import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { loadAllEntries, DailyEntry } from '../src/utils/storage';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function EntryRow({ item }: { item: DailyEntry }) {
  const isWeizen = item.choice === 'weizen';
  return (
    <View style={[styles.row, isWeizen ? styles.rowWeizen : styles.rowSpreu]}>
      <Text style={styles.rowEmoji}>{isWeizen ? '🌾' : '💨'}</Text>
      <View style={styles.rowText}>
        <Text style={styles.rowDate}>{formatDate(item.date)}</Text>
        <Text style={[styles.rowChoice, isWeizen ? styles.textWeizen : styles.textSpreu]}>
          {isWeizen ? 'Weizen' : 'Spreu'}
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAllEntries().then((all) => {
        const sorted = [...all].sort((a, b) => b.date.localeCompare(a.date));
        setEntries(sorted);
      });
    }, [])
  );

  const weizenCount = entries.filter((e) => e.choice === 'weizen').length;
  const spreuCount = entries.filter((e) => e.choice === 'spreu').length;

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={[styles.statBox, styles.statWeizen]}>
          <Text style={styles.statEmoji}>🌾</Text>
          <Text style={styles.statNumber}>{weizenCount}</Text>
          <Text style={styles.statLabel}>Weizen</Text>
        </View>
        <View style={[styles.statBox, styles.statSpreu]}>
          <Text style={styles.statEmoji}>💨</Text>
          <Text style={styles.statNumber}>{spreuCount}</Text>
          <Text style={styles.statLabel}>Spreu</Text>
        </View>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Noch keine Einträge.{'\n'}Beantworte die heutige Frage!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => <EntryRow item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF7', padding: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statWeizen: { backgroundColor: '#FFF3D0', borderWidth: 2, borderColor: '#D4A017' },
  statSpreu: { backgroundColor: '#F0F0F0', borderWidth: 2, borderColor: '#BDBDBD' },
  statEmoji: { fontSize: 28 },
  statNumber: { fontSize: 32, fontWeight: '900', color: '#5C3A1E' },
  statLabel: { fontSize: 14, color: '#8C6239', fontWeight: '600' },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  rowWeizen: { backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#F0C040' },
  rowSpreu: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  rowEmoji: { fontSize: 28 },
  rowText: { flex: 1 },
  rowDate: { fontSize: 13, color: '#8C6239' },
  rowChoice: { fontSize: 17, fontWeight: '700', marginTop: 2 },
  textWeizen: { color: '#B8860B' },
  textSpreu: { color: '#757575' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#A07840', textAlign: 'center', lineHeight: 24 },
});
