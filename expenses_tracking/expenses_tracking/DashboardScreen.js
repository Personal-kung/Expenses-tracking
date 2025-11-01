import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses, ExpenseEntry } from './ExpenseContext';

export default function ExpenseTableScreen({ navigation }: any) {
  const { expenses, updateExpense } = useExpenses();

  const formatAmount = (amt: number) => {
    return amt.toFixed(2);
  };

  const renderItem = ({ item }: { item: ExpenseEntry }) => {
    const isNeg = item.amount < 0;
    return (
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Register', {
              datetimeMs: item.datetime.getTime(),
            });
          }}>
          <Ionicons name="pencil" size={20} color="blue" />
        </TouchableOpacity>

        <View style={styles.cell}>
          <Text style={styles.cellText}>
            {new Date(item.datetime).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.cell}>
          <Text
            style={[
              styles.cellText,
              isNeg ? styles.negativeText : styles.positiveText,
            ]}>
            {formatAmount(item.amount)}
          </Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.reason}</Text>
        </View>

        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.paymentMethod}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailsButtonCell}
          onPress={() =>
            navigation.navigate('DetailScreen', {
              datetimeMs: item.datetime.getTime(),
            })
          }>
          <Ionicons name="information-circle-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow]}>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>日時</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>支払い金額</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>理由</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>支払い方法</Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No entries yet</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  headerRow: { backgroundColor: '#ddd' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  headerCell: { flex: 1, paddingHorizontal: 4, justifyContent: 'center' },
  headerText: { fontWeight: 'bold', textAlign: 'center' },
  cell: { flex: 1, paddingHorizontal: 4 },
  cellText: {},
  negativeText: { color: 'red' },
  positiveText: { color: 'black' },
  emptyText: { marginTop: 20, textAlign: 'center', color: '#666' },
  detailsButtonCell: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
