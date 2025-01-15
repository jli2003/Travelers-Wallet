import React from 'react';
import { View, StyleSheet } from 'react-native';
import CurrencyConverter from '../CurrencyConverter'


export default function Home() {
  return (
    <View style={styles.container}>
      <CurrencyConverter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
