import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//datatypes restrictions
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'digital';

export interface ExpenseEntry {
  datetime: Date;
  amount: number;
  reason: string;
  paymentMethod: PaymentMethod;
  // optional fields
  details?: string;
  store?: string;
  sharedFor?: 'for' | 'shared';
  additionalDetails?: string;
}

//for localstorage
interface ExpenseContextType {
  expenses: ExpenseEntry[];
  addExpense: (entry: ExpenseEntry) => void;
  updateExpense: (datetimeMs: number, newData: ExpenseUpdate) => void;
  deleteExpense: (datetimeMs: number) => void;
}
const STORAGE_KEY = '@expenses_list';

// 1. Create the context
const ExpensesContext = createContext();

// 2. Create a provider component
export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]); // this holds all expense entries

  // Load from AsyncStorage on mount
  useEffect(() => {
    const load = async () => {
      console.log("into the load function")
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed: any[] = JSON.parse(json);
          // Convert parsed to ExpenseEntry[], ensuring datetime as Date
          const loaded: ExpenseEntry[] = parsed.map((obj) => ({
            ...obj,
            datetime: new Date(obj.datetime),
          }));
          setExpenses(loaded);
        }
        console.log("Data read and loaded")
      } catch (err) {
        console.error('Failed to load expenses from storage', err);
      }
    };
    load();
  }, []);

  const persistExpenses = async () => {
    try {
      // console.log('called persistExpenses function');
      const serializable = expenses.map((e) => ({
        ...e,
        datetime: e.datetime.toISOString(),
      }));
      const json = JSON.stringify(serializable);
      await AsyncStorage.setItem(STORAGE_KEY, json);
      // optionally; console.log("Saved to storage");
    } catch (e) {
      console.error('Persist expenses error:', e);
    }
  };

  // function to add a new expense
  const addExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  // Update existing entry by matching datetime
  const updateExpense = (datetimeMs: number, newData: ExpenseUpdate) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.datetime.getTime() === datetimeMs) {
          // Merge
          const merged = { ...e, ...newData };
          return merged;
        } else {
          return e;
        }
      })
    );
  };

  const deleteExpense = (datetimeMs: number) => {
    setExpenses((prev) =>
      prev.filter((e) => e.datetime.getTime() !== datetimeMs)
    );
  };

  return (
    <ExpensesContext.Provider
      value={{ expenses, setExpenses, persistExpenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
};

// 3. Custom hook to use the context more easily
export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpensesProvider');
  }
  return context;
};
