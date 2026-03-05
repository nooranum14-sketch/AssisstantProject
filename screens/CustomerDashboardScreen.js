import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';

const CustomerDashboardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Green Header Section */}
      <View style={styles.headerCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
             <Text style={{fontSize: 30}}>👤</Text>
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.userName}>Shopper</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.gridContainer}>
          {/* Create List Button */}
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
               <Text style={{fontSize: 24, color: '#4F46E5'}}>≡+</Text>
            </View>
            <Text style={styles.actionLabel}>Create List</Text>
          </TouchableOpacity>

          {/* Past Orders Button */}
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
               <Text style={{fontSize: 24, color: '#EA580C'}}>🕒</Text>
            </View>
            <Text style={styles.actionLabel}>Past Orders</Text>
          </TouchableOpacity>

          {/* Profile Button */}
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8' }]}>
               <Text style={{fontSize: 24, color: '#DB2777'}}>👤</Text>
            </View>
            <Text style={styles.actionLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerCard: {
    backgroundColor: '#147A44', // Dark Green background like SS
    paddingHorizontal: 25,
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#A0AEC0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  welcomeTextContainer: { marginLeft: 15 },
  helloText: { color: '#E2E8F0', fontSize: 18 },
  userName: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
  contentSection: { padding: 25 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D3748', marginBottom: 25 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    // Shadow for iOS & Android
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 15, fontWeight: '600', color: '#4A5568' }
});

export default CustomerDashboardScreen;