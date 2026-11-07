import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminStackParamList, AdminTabParamList } from './types';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import CompanyManagementScreen from '../screens/admin/CompanyManagementScreen';
import CompanyFormScreen from '../screens/admin/CompanyFormScreen';
import ApplicationManagementScreen from '../screens/admin/ApplicationManagementScreen';
import ApplicationReviewScreen from '../screens/admin/ApplicationReviewScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import InternshipDetailScreen from '../screens/shared/InternshipDetailScreen';
import DailyLogDetailScreen from '../screens/shared/DailyLogDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

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

// Tab navigator untuk menu utama admin
const AdminTabs: React.FC = () => (
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
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'grid', 'grid-outline'),
      }}
    />
    <Tab.Screen
      name="UserManagement"
      component={UserManagementScreen}
      options={{
        title: 'Pengguna',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'people', 'people-outline'),
      }}
    />
    <Tab.Screen
      name="CompanyManagement"
      component={CompanyManagementScreen}
      options={{
        title: 'Perusahaan',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'business', 'business-outline'),
      }}
    />
    <Tab.Screen
      name="ApplicationManagement"
      component={ApplicationManagementScreen}
      options={{
        title: 'Pengajuan',
        tabBarIcon: ({ focused }) => tabIcon(focused, 'document-text', 'document-text-outline'),
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

// Stack navigator — membungkus tabs + screen tambahan (form, detail, review)
const AdminNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminTabs" component={AdminTabs} />
    <Stack.Screen name="CompanyForm" component={CompanyFormScreen} />
    <Stack.Screen name="ApplicationReview" component={ApplicationReviewScreen} />
    <Stack.Screen name="InternshipDetail" component={InternshipDetailScreen} />
    <Stack.Screen name="DailyLogDetail" component={DailyLogDetailScreen} />
  </Stack.Navigator>
);

export default AdminNavigator;