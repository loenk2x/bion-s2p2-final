import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from '@shared/AuthProvider';
import { api, setToken, tokenStorage } from './src/lib/api';

// Temporary until Langkah 3 adds real navigation: proves the API client and
// AuthProvider wiring (Langkah 2) actually renders using the shared login
// state, not just that it imports cleanly.
function AuthStatus() {
  const { loading, signedIn } = useAuth();
  const status = loading ? 'Memeriksa sesi...' : signedIn ? 'Sudah masuk' : 'Belum masuk';
  return (
    <View style={styles.container}>
      <Text>Healthy Life mobile</Text>
      <Text>Status autentikasi: {status}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider api={api} setToken={setToken} storage={tokenStorage}>
      <AuthStatus />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
});
