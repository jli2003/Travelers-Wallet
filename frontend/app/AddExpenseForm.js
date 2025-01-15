import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ExpenseItem = ({ id, name, cost, onDelete }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{name}</Text>
    <Text style={styles.itemText}>${cost}</Text>
    <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

const AddExpenseForm = ({ onAddExpense }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  const submitExpense = () => {
    if (name && cost) {
      onAddExpense({ name, cost: parseFloat(cost).toFixed(2) });
      setName('');
      setCost('');
    } else {
      console.error('Name and cost must be provided.');
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Enter expense name"
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        value={cost}
        placeholder="Enter cost"
        keyboardType="numeric"
        onChangeText={setCost}
      />
      <Button title="Add Expense" onPress={submitExpense} />
    </View>
  );
};

export default function Budget() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState("2000"); // Keep the budget as a string for TextInput

  const addExpense = (expense) => {
    setExpenses(currentExpenses => [
      ...currentExpenses,
      { id: Math.random().toString(), ...expense }
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses(currentExpenses => 
      currentExpenses.filter(expense => expense.id !== id)
    );
  };

  const totalSpent = useMemo(() => 
    expenses.reduce((sum, expense) => sum + parseFloat(expense.cost), 0), [expenses]
  );

  const remainingBudget = useMemo(() => parseFloat(budget) - totalSpent, [budget, totalSpent]);

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget.replace(/[^0-9.]/g, '')); // This regex removes any non-numeric characters
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Budget Planner:</Text>
      <View style={styles.summaryRow}>
        <TextInput
          style={styles.budgetInput}
          value={budget}
          onChangeText={handleBudgetChange}
          keyboardType="numeric"
          returnKeyType="done"
          placeholder="Set your budget"
        />
        <Text style={styles.summaryText}>Remaining: ${remainingBudget.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Spent: ${totalSpent.toFixed(2)}</Text>
      </View>
      <AddExpenseForm onAddExpense={addExpense} />
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            id={item.id}
            name={item.name}
            cost={item.cost}
            onDelete={deleteExpense}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center'
  },
  summaryText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center'
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    flex: 1,
    fontSize: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});
