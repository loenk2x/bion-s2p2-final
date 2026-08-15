// Account creation. Mirrors web/src/pages/Register.jsx: the same four
// validators from @shared/register, registration signs the user in, and a
// successful submit lands on the tab navigator (RootNavigator switches to
// AppNavigator automatically once useAuth().signedIn flips true).

import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@shared/AuthProvider";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from "@shared/register";
import Icon from "../components/Icon";
import { colors, radius, spacing } from "../theme/colors";

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const checks = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };
    const errors = {};
    for (const [field, result] of Object.entries(checks)) {
      if (result.message) errors[field] = result.message;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      // No explicit navigation call: RootNavigator swaps to AppNavigator by
      // itself once useAuth().signedIn becomes true.
    } catch (err) {
      setFormError(err.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Icon name="leaf" size={20} color={colors.hijau600} />
            <Text style={styles.logoText}>Healthy Life</Text>
          </View>

          <Text style={styles.title}>Buat akun</Text>
          <Text style={styles.subtitle}>Registrasi wajib sebelum membuka konten.</Text>

          {formError ? <View style={styles.errorBox}><Text style={styles.errorBoxText}>{formError}</Text></View> : null}

          <Field label="Nama lengkap" value={name} onChangeText={setName} placeholder="Nama Anda" error={fieldErrors.name} />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={fieldErrors.email}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 8 karakter"
            secureTextEntry
            error={fieldErrors.password}
          />
          <Field
            label="Konfirmasi password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Ulangi password"
            secureTextEntry
            error={fieldErrors.confirmPassword}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "Mendaftarkan…" : "Daftar"}</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("masuk")}>
              <Text style={styles.footerLink}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, error && styles.inputError]} placeholderTextColor={colors.tinta400} {...inputProps} />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
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
  inputError: { borderColor: colors.bahaya },
  fieldError: { color: colors.bahaya, fontSize: 12, marginTop: 4 },
  primaryButton: {
    backgroundColor: colors.hijau600,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.s8
  },
  primaryButtonText: { color: colors.putih, fontWeight: "700", fontSize: 15 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.s20 },
  footerText: { color: colors.tinta600, fontSize: 13 },
  footerLink: { color: colors.hijau600, fontWeight: "700", fontSize: 13 }
});
