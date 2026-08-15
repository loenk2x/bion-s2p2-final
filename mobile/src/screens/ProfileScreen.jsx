// Profil. Mirrors web/src/pages/Profile.jsx: avatar/summary card, editable
// name + bio, change password, sign out.
//
// changePassword sends fields "passwordLama" and "passwordBaru" - part of
// the API contract (RENCANA-MOBILE.md section 5), not a naming choice made
// here.

import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@shared/AuthProvider";
import Icon from "../components/Icon";
import InitialsAvatar from "../components/InitialsAvatar";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

const MIN_PASSWORD_LENGTH = 8;

export default function ProfileScreen() {
  const { user, updateProfile, signOut } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function saveProfile() {
    setProfileMessage("");
    setProfileError("");
    setProfileSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      setProfileMessage("Perubahan tersimpan.");
    } catch (err) {
      setProfileError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function savePassword() {
    setPasswordMessage("");
    setPasswordError("");
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }
    setPasswordSaving(true);
    try {
      await api.changePassword({ passwordLama: oldPassword, passwordBaru: newPassword });
      setPasswordMessage("Password berhasil diperbarui.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.message || "Gagal memperbarui password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Data akun Anda.</Text>

      <View style={styles.card}>
        <InitialsAvatar name={user?.name} size={80} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Icon name="signOut" size={16} color={colors.putih} />
          <Text style={styles.signOutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Data diri</Text>
        <Field label="Nama" value={name} onChangeText={setName} />
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.readonlyText}>{user?.email}</Text>
          </View>
        </View>
        <Field label="Bio" value={bio} onChangeText={setBio} placeholder="Ceritakan sedikit tentang Anda" />
        {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}
        {profileMessage ? <Text style={styles.successText}>{profileMessage}</Text> : null}
        <TouchableOpacity style={[styles.primaryButton, profileSaving && styles.disabled]} disabled={profileSaving} onPress={saveProfile}>
          <Text style={styles.primaryButtonText}>{profileSaving ? "Menyimpan…" : "Simpan perubahan"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Ganti password</Text>
        <Field label="Password lama" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
        <Field label="Password baru" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {passwordMessage ? <Text style={styles.successText}>{passwordMessage}</Text> : null}
        <TouchableOpacity style={[styles.neutralButton, passwordSaving && styles.disabled]} disabled={passwordSaving} onPress={savePassword}>
          <Text style={styles.neutralButtonText}>{passwordSaving ? "Memperbarui…" : "Perbarui password"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.tinta400} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.latar },
  scroll: { padding: spacing.s16, paddingBottom: spacing.s40, gap: spacing.s16 },
  title: { fontSize: 22, fontWeight: "700", color: colors.tinta900, marginTop: spacing.s8 },
  subtitle: { fontSize: 13, color: colors.tinta600, marginBottom: spacing.s8 },
  card: {
    backgroundColor: colors.putih,
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.md,
    padding: spacing.s20,
    alignItems: "stretch"
  },
  name: { fontSize: 18, fontWeight: "700", color: colors.tinta900, marginTop: spacing.s12, textAlign: "center" },
  email: { fontSize: 12, color: colors.tinta600, marginTop: 2, marginBottom: spacing.s16, textAlign: "center" },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.bahaya,
    borderRadius: radius.sm,
    paddingVertical: 12
  },
  signOutText: { color: colors.putih, fontWeight: "700", fontSize: 14 },
  cardHeading: { fontSize: 15, fontWeight: "700", color: colors.tinta900, marginBottom: spacing.s16 },
  field: { marginBottom: spacing.s12 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.tinta900, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.tinta900
  },
  readonlyInput: { backgroundColor: colors.latar, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10 },
  readonlyText: { fontSize: 14, color: colors.tinta600 },
  errorText: { color: colors.bahaya, fontSize: 12, marginBottom: spacing.s8 },
  successText: { color: colors.hijau700, fontSize: 12, marginBottom: spacing.s8 },
  primaryButton: { backgroundColor: colors.hijau600, borderRadius: radius.sm, paddingVertical: 12, alignItems: "center", marginTop: spacing.s8 },
  disabled: { opacity: 0.6 },
  primaryButtonText: { color: colors.putih, fontWeight: "700", fontSize: 14 },
  neutralButton: { backgroundColor: colors.latar, borderRadius: radius.sm, paddingVertical: 12, alignItems: "center", marginTop: spacing.s8 },
  neutralButtonText: { color: colors.tinta900, fontWeight: "700", fontSize: 14 }
});
