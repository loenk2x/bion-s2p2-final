// Sign-in. Mirrors web/src/pages/SignIn.jsx, including the "isi akun demo"
// shortcut that fills the demo account's credentials.

import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@shared/AuthProvider";
import Icon from "../components/Icon";
import { colors, radius, spacing } from "../theme/colors";

const DEMO_EMAIL = "demo@healthylife.id";
const DEMO_PASSWORD = "demo12345";

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(nextEmail, nextPassword) {
    setFormError("");
    setSubmitting(true);
    try {
      await signIn(nextEmail, nextPassword);
      // RootNavigator swaps to AppNavigator on its own once signedIn is true.
    } catch (err) {
      setFormError(err.message || "Masuk gagal. Periksa email dan password Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoAccount() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Icon name="leaf" size={20} color={colors.hijau600} />
            <Text style={styles.logoText}>Healthy Life</Text>
          </View>

          <Text style={styles.title}>Masuk</Text>
          <Text style={styles.subtitle}>Gunakan email dan password Anda.</Text>

          {formError ? <View style={styles.errorBox}><Text style={styles.errorBoxText}>{formError}</Text></View> : null}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="nama@email.com"
              placeholderTextColor={colors.tinta400}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.tinta400}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => submit(email.trim(), password)} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "Memeriksa…" : "Masuk"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={fillDemoAccount} disabled={submitting}>
            <Text style={styles.secondaryButtonText}>Isi akun demo</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("daftar")}>
              <Text style={styles.footerLink}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.putih },
  scroll: { padding: spacing.s20, gap: spacing.s4 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.s16 },
  logoText: { fontSize: 18, fontWeight: "700", color: colors.tinta900 },
  title: { fontSize: 26, fontWeight: "700", color: colors.tinta900 },
  subtitle: { fontSize: 14, color: colors.tinta600, marginTop: 4, marginBottom: spacing.s20 },
  errorBox: { backgroundColor: colors.bahaya100, borderRadius: radius.sm, padding: spacing.s12, marginBottom: spacing.s16 },
  errorBoxText: { color: colors.bahaya, fontSize: 13 },
  field: { marginBottom: spacing.s16 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.tinta900, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.tinta900,
    backgroundColor: colors.putih
  },
  primaryButton: {
    backgroundColor: colors.hijau600,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.s8
  },
  primaryButtonText: { color: colors.putih, fontWeight: "700", fontSize: 15 },
  secondaryButton: {
    backgroundColor: colors.hijau50,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.s12
  },
  secondaryButtonText: { color: colors.hijau700, fontWeight: "700", fontSize: 15 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.s20 },
  footerText: { color: colors.tinta600, fontSize: 13 },
  footerLink: { color: colors.hijau600, fontWeight: "700", fontSize: 13 }
});
