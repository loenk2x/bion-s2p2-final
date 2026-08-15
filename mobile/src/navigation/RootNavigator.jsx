// Top-level navigation. A stack for the screens before login (Landing,
// Register, SignIn) and a separate stack for everything behind the login
// wall (the bottom-tab group plus content detail, which pushes over the
// tabs the same way ContentDetail pushes over AppShell on the web).
//
// Route names stay Indonesian to match the web app's paths, per
// RENCANA-MOBILE.md section 3: landing, daftar, masuk, then the tab names
// (beranda, favorit, catatan, profil) plus kontenDetail.

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@shared/AuthProvider";
import Loading from "../components/Loading";
import MainTabs from "./MainTabs";
import LandingScreen from "../screens/LandingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SignInScreen from "../screens/SignInScreen";
import ContentDetailScreen from "../screens/ContentDetailScreen";

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="landing" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="landing" component={LandingScreen} />
      <AuthStack.Screen name="daftar" component={RegisterScreen} />
      <AuthStack.Screen name="masuk" component={SignInScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="tabs" component={MainTabs} />
      <AppStack.Screen name="kontenDetail" component={ContentDetailScreen} />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { loading, signedIn } = useAuth();

  if (loading) return <Loading message="Memeriksa sesi Anda…" />;

  return (
    <NavigationContainer>
      {signedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
