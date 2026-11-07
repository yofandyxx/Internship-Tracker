import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SupervisorStackParamList, SupervisorTabParamList } from './types';
import SupervisorDashboardScreen from '../screens/supervisor/SupervisorDashboardScreen';
import SupervisedStudentsScreen from '../screens/supervisor/SupervisedStudentsScreen';
import LogReviewScreen from '../screens/supervisor/LogReviewScreen';
import EvaluationFormScreen from '../screens/supervisor/EvaluationFormScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import InternshipDetailScreen from '../screens/shared/InternshipDetailScreen';
import DailyLogDetailScreen from '../screens/shared/DailyLogDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<SupervisorTabParamList>();
const Stack = createNativeStackNavigator<SupervisorStackParamList>();

const tabIcon = (
  focused: boolean,
  name: keyof typeof Ionicons.glyphMap,
  outlined: keyof typeof Ionicons.glyphMap
) => (
  <Ionicons
    name={focused ? name : outlined}
    size={22}
    color={focused ? COLORS.primary : COLORS.textSecondary}
  />
);

// Tab navigator untuk menu utama pembimbing
const SupervisorTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}
  >
    <Tab.Screen
      name="SupervisorDashboard"
      component={SupervisorDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'grid', 'grid-outline'),
      }}
    />
    <Tab.Screen
      name="SupervisedStudents"
      component={SupervisedStudentsScreen}
      options={{
        title: 'Mahasiswa',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'people', 'people-outline'),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'person-circle', 'person-circle-outline'),
      }}
    />
  </Tab.Navigator>
);

// Stack navigator — review & evaluasi di atas tabs
const SupervisorNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SupervisorTabs" component={SupervisorTabs} />
    <Stack.Screen name="LogReview" component={LogReviewScreen} />
    <Stack.Screen name="EvaluationForm" component={EvaluationFormScreen} />
    <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} />
    <Stack.Screen name="DailyLogDetail" component={DailyLogDetailScreen} />
  </Stack.Navigator>
);

export default SupervisorNavigator;