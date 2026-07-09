/**
 * simplyPet: Navigation
 * Quelle: technische_spezifikation_screen_flow.md
 *
 * Vier feste Bereiche in der Tab-Bar: Zuhause, Termine, Erfassen, Mehr.
 * Korrektur aus Zwischenanalyse (09.07.2026): "Erfassen" ist KEIN eigener
 * Bildschirm mehr, sondern oeffnet ein Overlay (BottomSheet) ueber dem
 * aktuellen Bildschirm. Der Notfallpass ist von jedem Hauptbildschirm in
 * maximal zwei Taps erreichbar (grosser Knopf auf Zuhause + FAB auf
 * Termine/Mehr).
 *
 * Kontoloses Onboarding (Freigabe 09.07.2026): Beim ersten Start zeigt
 * die App das Onboarding (Begruessung -> Halter-Name -> erstes Tier);
 * danach dauerhaft die Hauptnavigation.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Pressable, View, ActivityIndicator, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import MoreScreen from '../screens/MoreScreen';
import EmergencyPassScreen from '../screens/EmergencyPassScreen';
import PetFileScreen from '../screens/PetFileScreen';
import AddPetScreen from '../screens/AddPetScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CaptureSheet from '../components/CaptureSheet';
import { isOnboardingDone } from '../profile/profileStore';
import { colors, typography } from '../theme/theme';

export type RootStackParamList = {
  Tabs: undefined;
  Notfallpass: { petId?: string } | undefined;
  Tierakte: { petId: string };
  TierAnlegen: { firstPet?: boolean } | undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Platzhalter fuer den Erfassen-Tab: wird nie angezeigt, der Tab oeffnet nur das Overlay. */
function CapturePlaceholder() {
  return null;
}

function Tabs() {
  const [captureOpen, setCaptureOpen] = useState(false);

  // Der Erfassen-"Tab" ist ein reiner Ausloeser fuer das Overlay –
  // er wechselt NIE den Bildschirm (Screen-Flow 2.4).
  const captureTabButton = useCallback(
    (props: BottomTabBarButtonProps) => (
      <Pressable
        {...(props as any)}
        onPress={() => setCaptureOpen(true)}
        accessibilityLabel="Erfassen: Neuen Eintrag beginnen"
        accessibilityRole="button"
      />
    ),
    []
  );

  return (
    <View style={styles.flex}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: typography.bodySmall - 2 },
          tabBarStyle: { height: 64, paddingBottom: 8 },
        }}
      >
        <Tab.Screen
          name="Zuhause"
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⌂</Text> }}
        />
        <Tab.Screen
          name="Termine"
          component={AppointmentsScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>▤</Text> }}
        />
        <Tab.Screen
          name="Erfassen"
          component={CapturePlaceholder}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>＋</Text>,
            tabBarButton: captureTabButton,
          }}
        />
        <Tab.Screen
          name="Mehr"
          component={MoreScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>≡</Text> }}
        />
      </Tab.Navigator>
      <CaptureSheet visible={captureOpen} onClose={() => setCaptureOpen(false)} />
    </View>
  );
}

export default function AppNavigator() {
  // Onboarding-Status: null = wird geladen, false = Onboarding zeigen, true = App.
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const done = await isOnboardingDone();
      if (active) setOnboarded(done);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (onboarded === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {onboarded ? (
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: { fontSize: typography.title },
            headerTintColor: colors.textPrimary,
          }}
        >
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="Notfallpass"
            component={EmergencyPassScreen}
            options={{ title: 'Notfall-Pass' }}
          />
          <Stack.Screen name="Tierakte" component={PetFileScreen} options={{ title: 'Tierakte' }} />
          <Stack.Screen
            name="TierAnlegen"
            component={AddPetScreen}
            options={{ title: 'Tier hinzufügen' }}
          />
        </Stack.Navigator>
      ) : (
        <OnboardingScreen onDone={() => setOnboarded(true)} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
