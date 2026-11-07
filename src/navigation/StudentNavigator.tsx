import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StudentStackParamList, StudentTabParamList } from './types';
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import CompanyListScreen from '../screens/student/CompanyListScreen';
import MyInternshipScreen from '../screens/student/MyInternshipScreen';
import DailyLogScreen from '../screens/student/DailyLogScreen';
import MyEvaluationScreen from '../screens/student/MyEvaluationScreen';
import InternshipApplicationScreen from '../screens/student/InternshipApplicationScreen';
import DailyLogFormScreen from '../screens/student/DailyLogFormScreen';
import InternshipDetailScreen from '../screens/shared/InternshipDetailScreen';
import DailyLogDetailScreen from '../screens/shared/DailyLogDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const Stack = createNativeStackNavigator<StudentStackParamList>();

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

// Tab navigator untuk menu utama mahasiswa
const StudentTabs: React.FC = () => (
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
      name="StudentDashboard"
      component={StudentDashboardScreen}
      options={{
        title: 'Beranda',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'home', 'home-outline'),
      }}
    />
    <Tab.Screen
      name="CompanyList"
      component={CompanyListScreen}
      options={{
        title: 'Perusahaan',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'business', 'business-outline'),
      }}
    />
    <Tab.Screen
      name="MyInternship"
      component={MyInternshipScreen}
      options={{
        title: 'Magang',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'briefcase', 'briefcase-outline'),
      }}
    />
    <Tab.Screen
      name="DailyLog"
      component={DailyLogScreen}
      options={{
        title: 'Jurnal',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'document-text', 'document-text-outline'),
      }}
    />
    <Tab.Screen
      name="MyEvaluation"
      component={MyEvaluationScreen}
      options={{
        title: 'Nilai',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'ribbon', 'ribbon-outline'),
      }}
    />
  </Tab.Navigator>
);

// Stack navigator — form & detail di atas tabs
const StudentNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentTabs" component={StudentTabs} />
    <Stack.Screen name="InternshipApplication" component={InternshipApplicationScreen} />
    <Stack.Screen name="DailyLogForm" component={DailyLogFormScreen} />
    <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} />
    <Stack.Screen name="DailyLogDetail" component={DailyLogDetailScreen} />
  </Stack.Navigator>
);

export default StudentNavigator;