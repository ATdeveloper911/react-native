import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export const ReportsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Citizen Reports
      </Text>
      <Text>Report management features coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});

