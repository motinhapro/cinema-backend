import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#141414', borderTopColor: '#333', borderTopWidth: 1, paddingBottom: 8, paddingTop: 8, height: 60 },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="film-outline" size={size} color={color} />, tabBarLabel: 'Filmes' }} />
      <Tabs.Screen name="tickets" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="ticket-outline" size={size} color={color} />, tabBarLabel: 'Pedidos' }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />, tabBarLabel: 'Perfil' }} />
    </Tabs>
  );
}