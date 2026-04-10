import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../../config';

import LoginScreen    from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen     from '../screens/HomeScreen';
import PredictScreen  from '../screens/PredictScreen';
import UploadReportScreen from '../screens/UploadReportScreen';
import AssistantScreen    from '../screens/AssistantScreen';
import ProfileScreen      from '../screens/ProfileScreen';
import DiabetesPredictionScreen from '../screens/DiabetesPredictionScreen';
import HeartPredictionScreen    from '../screens/HeartPredictionScreen';
import LungPredictionScreen     from '../screens/LungPredictionScreen';
import { DermatosisPredictionScreen, PneumoniaPredictionScreen } from '../screens/PlaceholderScreens';

const Stack  = createStackNavigator();
const Tab    = createBottomTabNavigator();
const PStack = createStackNavigator();

const TABS = [
  { name: 'Home',      icon: '🏠' },
  { name: 'Predict',   icon: '🧬' },
  { name: 'Upload',    icon: '📋' },
  { name: 'Assistant', icon: '🤖' },
  { name: 'Profile',   icon: '👤' },
];

const TabIcon = ({ icon, focused }) => (
  <View style={[ti.wrap, focused && ti.wrapActive]}>
    <Text style={ti.icon}>{icon}</Text>
  </View>
);

const ti = StyleSheet.create({
  wrap:       { alignItems: 'center', paddingVertical: 2 },
  wrapActive: {},
  icon:       { fontSize: 22 },
});

const PredictStackNav = () => (
  <PStack.Navigator screenOptions={{ headerShown: false }}>
    <PStack.Screen name="PredictHub"  component={PredictScreen} />
    <PStack.Screen name="Diabetes"    component={DiabetesPredictionScreen} />
    <PStack.Screen name="Heart"       component={HeartPredictionScreen} />
    <PStack.Screen name="Lung"        component={LungPredictionScreen} />
    <PStack.Screen name="Dermatosis"  component={DermatosisPredictionScreen} />
    <PStack.Screen name="Pneumonia"   component={PneumoniaPredictionScreen} />
  </PStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const t = TABS.find(x => x.name === route.name);
      return {
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon icon={t?.icon || '●'} focused={focused} />,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
        tabBarStyle: {
          height: 62, paddingBottom: 8, paddingTop: 6,
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      };
    }}>
    <Tab.Screen name="Home"      component={HomeScreen}         options={{ tabBarLabel: 'Home'      }} />
    <Tab.Screen name="Predict"   component={PredictStackNav}    options={{ tabBarLabel: 'Predict'   }} />
    <Tab.Screen name="Upload"    component={UploadReportScreen} options={{ tabBarLabel: 'Reports'   }} />
    <Tab.Screen name="Assistant" component={AssistantScreen}    options={{ tabBarLabel: 'Assistant' }} />
    <Tab.Screen name="Profile"   component={ProfileScreen}      options={{ tabBarLabel: 'Profile'   }} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login"    component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;