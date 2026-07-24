/**
 * simplyPet: Navigation (v0.1.4 – E-75 Fix)
 * Quelle: technische_spezifikation_screen_flow.md + E-58 + E-69 + E-70 + E-75
 *
 * 5 feste Tabs: Zuhause, Termine, Erfassen, Mehr, Notfall.
 * - Notfall-Tab: ISO 7010 E003 (weisses Kreuz auf #237F52). EINZIGES gruenes
 *   Kreuz in der gesamten App (E-69).
 * - Erfassen-Tab: Oeffnet Overlay (kein eigener Screen). Icon ist ein
 *   Stift-Symbol (KEIN Plus in Gruen/Teal – E-69).
 * - EmergencyFab ENTFERNT (ersetzt durch 5. Tab).
 *
 * E-75: Tab-Bar muss auf ALLEN Screens sichtbar sein. Loesung: Jeder Tab
 * bekommt seinen eigenen Stack-Navigator. Unter-Screens (Tierakte, Formulare)
 * werden innerhalb des jeweiligen Tab-Stacks geoeffnet, sodass die Tab-Bar
 * nie verschwindet.
 *
 * Kontoloses Onboarding (Freigabe 09.07.2026): Beim ersten Start zeigt
 * die App das Onboarding (Begruessung -> Halter-Name -> erstes Tier);
 * danach dauerhaft die Hauptnavigation.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Pressable, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import MoreScreen from '../screens/MoreScreen';
import EmergencyPassScreen from '../screens/EmergencyPassScreen';
import PetFileScreen from '../screens/PetFileScreen';
import AddPetScreen from '../screens/AddPetScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CaptureSheet from '../components/CaptureSheet';
import type { CaptureAction } from '../components/CaptureSheet';
import WeightEntryScreen from '../screens/entries/WeightEntryScreen';
import ObservationEntryScreen from '../screens/entries/ObservationEntryScreen';
import IncidentEntryScreen from '../screens/entries/IncidentEntryScreen';
import VaccinationEntryScreen from '../screens/entries/VaccinationEntryScreen';
import MedicationEntryScreen from '../screens/entries/MedicationEntryScreen';
import FecalSampleEntryScreen from '../screens/entries/FecalSampleEntryScreen';
import DocumentCaptureScreen from '../screens/entries/DocumentCaptureScreen';
import ExaminationEntryScreen from '../screens/entries/ExaminationEntryScreen';
import EditPetScreen from '../screens/EditPetScreen';
import ManagePetsScreen from '../screens/ManagePetsScreen';
import { isOnboardingDone } from '../profile/profileStore';
import { colors, typography } from '../theme/theme';
import { navigationRef } from './navigationRef';

// ---------- Param Lists ----------

export type HomeStackParamList = {
  HomeMain: undefined;
  Tierakte: { petId: string };
  TierAnlegen: { firstPet?: boolean } | undefined;
  GewichtEintragen: { petId?: string } | undefined;
  BeobachtungEintragen: { petId?: string } | undefined;
  VorfallEintragen: { petId?: string } | undefined;
  ImpfungEintragen: { petId?: string } | undefined;
  MedikamentEintragen: { petId?: string } | undefined;
  DokumentAblegen: { petId?: string } | undefined;
  KotprobeEintragen: { petId?: string } | undefined;
  UntersuchungEintragen: { petId?: string } | undefined;
  StammdatenBearbeiten: { petId: string };
  TiereVerwalten: undefined;
  Notfallpass: { petId?: string } | undefined;
};

export type AppointmentsStackParamList = {
  AppointmentsMain: undefined;
};

export type MoreStackParamList = {
  MoreMain: undefined;
  TiereVerwalten: undefined;
};

// Fuer externe Navigation (Shortcut, Notification) behalten wir einen
// vereinfachten Typ bei:
export type RootStackParamList = HomeStackParamList;

// ---------- Stack Navigators fuer jeden Tab ----------

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const AppointmentsStack = createNativeStackNavigator<AppointmentsStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();
const Tab = createBottomTabNavigator();

/** Zuordnung Erfassen-Overlay-Option -> Ziel-Formular (Screen-Flow 2.4). */
const CAPTURE_ROUTE: Record<CaptureAction, keyof HomeStackParamList> = {
  foto: 'DokumentAblegen',
  gewicht: 'GewichtEintragen',
  notiz: 'BeobachtungEintragen',
  vorfall: 'VorfallEintragen',
  impfung: 'ImpfungEintragen',
  medikament: 'MedikamentEintragen',
  kotprobe: 'KotprobeEintragen',
  untersuchung: 'UntersuchungEintragen',
};

// ---------- Tab-interne Stacks ----------

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontSize: typography.title },
        headerTintColor: colors.textPrimary,
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Tierakte" component={PetFileScreen} options={{ title: 'Tierakte' }} />
      <HomeStack.Screen
        name="TierAnlegen"
        component={AddPetScreen}
        options={{ title: 'Tier hinzufügen' }}
      />
      <HomeStack.Screen
        name="GewichtEintragen"
        component={WeightEntryScreen}
        options={{ title: 'Gewicht festhalten' }}
      />
      <HomeStack.Screen
        name="BeobachtungEintragen"
        component={ObservationEntryScreen}
        options={{ title: 'Beobachtung notieren' }}
      />
      <HomeStack.Screen
        name="VorfallEintragen"
        component={IncidentEntryScreen}
        options={{ title: 'Vorfall festhalten' }}
      />
      <HomeStack.Screen
        name="ImpfungEintragen"
        component={VaccinationEntryScreen}
        options={{ title: 'Impfung eintragen' }}
      />
      <HomeStack.Screen
        name="MedikamentEintragen"
        component={MedicationEntryScreen}
        options={{ title: 'Medikament & Pflege' }}
      />
      <HomeStack.Screen
        name="KotprobeEintragen"
        component={FecalSampleEntryScreen}
        options={{ title: 'Kotprobe erfassen' }}
      />
      <HomeStack.Screen
        name="UntersuchungEintragen"
        component={ExaminationEntryScreen}
        options={{ title: 'Untersuchungsergebnis' }}
      />
      <HomeStack.Screen
        name="DokumentAblegen"
        component={DocumentCaptureScreen}
        options={{ title: 'Dokument ablegen' }}
      />
      <HomeStack.Screen
        name="StammdatenBearbeiten"
        component={EditPetScreen}
        options={{ title: 'Stammdaten bearbeiten' }}
      />
      <HomeStack.Screen
        name="TiereVerwalten"
        component={ManagePetsScreen}
        options={{ title: 'Tiere verwalten' }}
      />
      <HomeStack.Screen
        name="Notfallpass"
        component={EmergencyPassScreen}
        options={{ title: 'Notfall-Pass' }}
      />
    </HomeStack.Navigator>
  );
}

function AppointmentsStackScreen() {
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontSize: typography.title },
        headerTintColor: colors.textPrimary,
      }}
    >
      <AppointmentsStack.Screen
        name="AppointmentsMain"
        component={AppointmentsScreen}
        options={{ headerShown: false }}
      />
    </AppointmentsStack.Navigator>
  );
}

function MoreStackScreen() {
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontSize: typography.title },
        headerTintColor: colors.textPrimary,
      }}
    >
      <MoreStack.Screen name="MoreMain" component={MoreScreen} options={{ headerShown: false }} />
      <MoreStack.Screen
        name="TiereVerwalten"
        component={ManagePetsScreen}
        options={{ title: 'Tiere verwalten' }}
      />
    </MoreStack.Navigator>
  );
}

/** Platzhalter fuer den Erfassen-Tab: wird nie angezeigt, der Tab oeffnet nur das Overlay. */
function CapturePlaceholder() {
  return null;
}

// ---------- Haupt-Tab-Navigator ----------

function MainTabs() {
  const [captureOpen, setCaptureOpen] = useState(false);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // Overlay-Option gewaehlt: Sheet schliessen, Formular oeffnen.
  const handleCaptureAction = useCallback(
    (action: CaptureAction) => {
      setCaptureOpen(false);
      // Navigiere im HomeStack zum entsprechenden Formular
      navigation.navigate('Zuhause', { screen: CAPTURE_ROUTE[action] });
    },
    [navigation]
  );

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
          tabBarStyle: { height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom },
        }}
      >
        <Tab.Screen
          name="Zuhause"
          component={HomeStackScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⌂</Text> }}
        />
        <Tab.Screen
          name="Termine"
          component={AppointmentsStackScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>▤</Text> }}
        />
        <Tab.Screen
          name="Erfassen"
          component={CapturePlaceholder}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>✎</Text>,
            tabBarButton: captureTabButton,
          }}
        />
        <Tab.Screen
          name="Mehr"
          component={MoreStackScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>≡</Text> }}
        />
        <Tab.Screen
          name="Notfall"
          component={CapturePlaceholder}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              // Navigiere zum Notfallpass innerhalb des HomeStacks
              navigation.navigate('Zuhause', { screen: 'Notfallpass' });
            },
          }}
          options={{
            // ISO 7010 E003: Weisses Kreuz auf gruenem Grund (#237F52).
            tabBarIcon: () => (
              <View style={styles.emergencyTabIcon}>
                <Text style={styles.emergencyTabCross}>✚</Text>
              </View>
            ),
            tabBarActiveTintColor: colors.emergency,
            tabBarInactiveTintColor: colors.emergency,
            tabBarLabel: 'Notfall',
          }}
        />
      </Tab.Navigator>
      <CaptureSheet
        visible={captureOpen}
        onClose={() => setCaptureOpen(false)}
        onAction={handleCaptureAction}
      />
    </View>
  );
}

// ---------- Root Navigator ----------

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
    <NavigationContainer ref={navigationRef}>
      {onboarded ? <MainTabs /> : <OnboardingScreen onDone={() => setOnboarded(true)} />}
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
  /** ISO 7010 E003: Gruener Kreis/Quadrat mit weissem Kreuz */
  emergencyTabIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTabCross: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
