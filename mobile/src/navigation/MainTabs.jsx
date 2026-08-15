// Bottom tab bar for the five screens behind the login wall. Route names are
// Indonesian to match the web app's URL paths (/beranda, /favorit, /catatan,
// /profil), per RENCANA-MOBILE.md section 3. Shape follows the "Bottom tab"
// component in the Figma file: icon above a label, active tab in hijau600.

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "../components/Icon";
import { colors } from "../theme/colors";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import DailyLogScreen from "../screens/DailyLogScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "beranda", label: "Beranda", icon: "home", component: HomeScreen },
  { name: "favorit", label: "Favorit", icon: "bookmark", component: FavoritesScreen },
  { name: "catatan", label: "Catatan", icon: "notes", component: DailyLogScreen },
  { name: "profil", label: "Profil", icon: "profile", component: ProfileScreen }
];

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="beranda"
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name);
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.hijau600,
          tabBarInactiveTintColor: colors.tinta400,
          tabBarStyle: { borderTopColor: colors.garis, height: 60, paddingBottom: 8, paddingTop: 6 },
          tabBarLabel: tab.label,
          tabBarIcon: ({ color, size }) => <Icon name={tab.icon} size={size ?? 22} color={color} />
        };
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}
