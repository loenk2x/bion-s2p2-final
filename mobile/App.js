import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// Proof for Langkah 1: this value only exists in shared/activities.js, which
// sits outside mobile/. If metro.config.js is wrong, the bundler fails to
// resolve this import rather than the app rendering something wrong.
import { ACTIVITY_TYPES } from '@shared/activities';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>@shared/activities resolved. ACTIVITY_TYPES: {ACTIVITY_TYPES.join(', ')}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
