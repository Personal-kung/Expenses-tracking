import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useExpenses, ExpenseEntry } from "./ExpenseContext";

export default function DetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { expenses } = useExpenses();

  const datetimeMs = route.params?.datetimeMs;

  const [entry, setEntry] = useState();
  const [prevEntry, setPrevEntry] = useState();
  const [nextEntry, setNextEntry] = useState();

  useEffect(() => {
    if (datetimeMs != null) {
      // Sort entries by datetime ascending
      const sorted = [...expenses].sort(
        (a, b) => a.datetime.getTime() - b.datetime.getTime()
      );
      // Find index of current
      const index = sorted.findIndex(
        (e) => e.datetime.getTime() === datetimeMs
      );
      if (index >= 0) {
        setEntry(sorted[index]);
        // Prev, if exists
        if (index > 0) {
          setPrevEntry(sorted[index - 1]);
        } else {
          setPrevEntry(null);
        }
        // Next, if exists
        if (index < sorted.length - 1) {
          setNextEntry(sorted[index + 1]);
        } else {
          setNextEntry(null);
        }
      } else {
        setEntry(null);
        setPrevEntry(null);
        setNextEntry(null);
      }
    }
  }, [datetimeMs, expenses]);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text>No detail entry found.</Text>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate("Register", {
      datetimeMs: entry.datetime.getTime(),
    });
  };

  const goToPrevious = () => {
    if (prevEntry) {
      navigation.replace("DetailScreen", {
        datetimeMs: prevEntry.datetime.getTime(),
      });
    }
  };

  const goToNext = () => {
    if (nextEntry) {
      navigation.replace("DetailScreen", {
        datetimeMs: nextEntry.datetime.getTime(),
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Datetime:</Text>
        <Text style={styles.value}>{entry.datetime.toLocaleString()}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text
          style={[
            styles.value,
            entry.amount < 0 ? styles.negative : styles.positive,
          ]}
        >
          {entry.amount.toFixed(2)}
        </Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{entry.description}</Text>

        <Text style={styles.label}>Payment Method:</Text>
        <Text style={styles.value}>{entry.paymentMethod}</Text>


        {entry.store != null && (
          <>
            <Text style={styles.label}>Store:</Text>
            <Text style={styles.value}>{entry.store}</Text>
          </>
        )}

        {entry.additionalDetails != null && (
          <>
            <Text style={styles.label}>Expense sharing:</Text>
            <Text style={styles.value}>{entry.sharedFor}:{entry.additionalDetails}</Text>
          </>
        )}
      </ScrollView>

      {/* Buttons at bottom */}
      <View style={styles.buttonRow}>

        <TouchableOpacity
          style={[styles.button, !prevEntry && styles.buttonDisabled]}
          onPress={goToPrevious}
          disabled={!prevEntry}
        >
          <Text
            style={[
              styles.buttonText,
              !prevEntry && styles.buttonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !nextEntry && styles.buttonDisabled]}
          onPress={goToNext}
          disabled={!nextEntry}
        >
          <Text
            style={[
              styles.buttonText,
              !nextEntry && styles.buttonTextDisabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // leave space for buttons
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  negative: {
    color: "red",
  },
  positive: {
    color: "black",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
  },
  buttonDisabled: {
    borderColor: "#ccc",
    backgroundColor: "#eee",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
  buttonTextDisabled: {
    color: "#999",
  },
});
