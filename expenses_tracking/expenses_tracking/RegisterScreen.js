//RegisterScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message'; //banner notification
import { useRoute, useNavigation } from '@react-navigation/native';
import { useExpenses, ExpenseEntry} from './ExpenseContext';

export default function RegisterScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { expenses, addExpense, updateExpense, persistExpenses } = useExpenses();

  // console.log("RegisterScreen route.params:", route.params);
  //if reading data form the dashboard page
  const datetimeMs = route.params?.datetimeMs;

  //setting working variables
  const [datetime, setDatetime] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('現金');
  const [details, setDetails] = useState('');
  const [store, setStore] = useState('');
  const [sharedFor, setSharedFor] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Prefill form when editing
  useEffect(() => {
    if (datetimeMs != null) {
      const entry = expenses.find((e) => e.datetime.getTime() === datetimeMs);
      if (entry) {
        setDatetime(entry.datetime);
        setAmount(entry.amount.toString());
        setReason(entry.reason);
        setPaymentMethod(entry.paymentMethod);
        setDetails(entry.details);
        setStore(entry.store);
        setSharedFor(entry.sharedFor);
        setAdditionalDetails(entry.additionalDetails);
      }
    }
  }, [datetimeMs, expenses]);

  const handleSubmit = async () => {
    if (amount === '' || isNaN(Number(amount))) {
      alert('Please enter a valid number for amount.');
      return;
    }

    const now = new Date();// console.log ("store value: ",store)
    
    // Add expense logic here
    const newEntry: ExpenseEntry = {
      datetime: now,
      amount: Number(amount),
      reason,
      paymentMethod,
      details,
      store,
      sharedFor,
      additionalDetails,
    };

    if (datetimeMs != null) {
      updateExpense(datetimeMs, newEntry);
    } else {
      addExpense(newEntry);
    }

    try {
      await persistExpenses();
    } catch (err) {
      console.warn('Error saving to storage:', err);
    }

    // Show success toast
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Expense Registered',
      text2: 'Your expense has been successfully registered.',
      visibilityTime: 3000, // 3 seconds
      autoHide: true,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: 'white' }}>
        日時: {datetime.toLocaleString()}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="支払い金額"
        placeholderTextColor="white"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="理由"
        value={reason}
        onChangeText={setReason}
      />

      <Text style={{ color: 'white' }}>支払方法</Text>
      <View style={styles.paymentGrid}>
        {['現金','JPBank','JABank','Revolut'].map((method) => {
          const isSelected = paymentMethod === method;
          return (
            <TouchableOpacity
              key={method}
              style={[styles.button, isSelected ? styles.buttonSelected : null]}
              onPress={() => setPaymentMethod(method)}>
              <Text>{method}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder="詳細"
        placeholderTextColor="white"
        value={details}
        onChangeText={setDetails}
      />
      <TextInput
        style={styles.input}
        placeholder="店"
        placeholderTextColor="white"
        value={store}
        onChangeText={setStore}
      />

      <View style={styles.paymentGrid}>
        {['for', 'shared'].map((method) => {
          const isSelected = sharedFor === method;
          return (
            <TouchableOpacity
              key={method}
              style={[styles.button, isSelected ? styles.buttonSelected : null]}
              onPress={() => setSharedFor(method)}>
              <Text>{method}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder="人々"
        placeholderTextColor="white"
        value={additionalDetails}
        onChangeText={setAdditionalDetails}
      />

      <Button title="保存" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    color: 'white',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#888',
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#bb86fc',
  },
  buttonSelected: {
    backgroundColor: '#ddd',
  },
});
