/**
 * simplyPet: Navigation
 * Quelle: technische_spezifikation_screen_flow.md
 *
 * Vier feste Bereiche (Zuhause, Termine, Erfassen, Mehr) plus
 * der ueberall erreichbare Notfallpass (Zwei-Tap-Regel).
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import CaptureScreen from '../screens/CaptureScreen';
import MoreScreen from '../screens/MoreScreen';
import EmergencyPassScreen from '../screens/EmergencyPassScreen';
import PetFileScreen from '../screens/PetFileScreen';
import AddPetScreen from '../screens/AddPetScreen';
import { colors, typography } from '../theme/theme';

export type RootStackParamList = {
  Tabs: undefined;
  Notfallpass: { petId?: string } | undefined;
  Tierakte: { petId: string };
  TierAnlegen: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
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
        component={CaptureScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>＋</Text> }}
      />
      <Tab.Screen
        name="Mehr"
        component={MoreScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>≡</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
