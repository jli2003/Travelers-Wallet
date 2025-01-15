import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import ProgressBar from 'react-native-progress/Bar';
import { PieChart } from 'react-native-chart-kit';


const Budget = () => {
  const [budget, setBudget] = useState('0');
  const [isModalVisible, setModalVisibility] = useState(false);
  const [originalBudget, setOriginalBudget] = useState('0');

  const [expenseModal, toggleExpenseModal] = useState(false);
  const [expenseType, setExpenseType] = useState('');
  const [expenseCost, setExpenseCost] = useState('');

  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('USD');
  const [value, setValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');
  const [currencies_arr, setCurrencies] = useState([]);

  const [expenseTypes, setExpenseTypes] = useState([
    {
      name: 'Food',
      amount: 0,
      color: '#FF968A',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10
    },
    {
      name:'Transportion',
      amount: 0,
      color: '#FFFFB5',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10
    },
    {
      name:'Living',
      amount: 0,
      color: '#ABDEE6',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10
    },
    {
      name:'Shopping',
      amount: 0,
      color: '#B6CFB6',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10
    },
    {
      name: 'Sightseeing',
      amount: 0,
      color: '#FEE1E8',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10
    },
    {
      name: 'Other',
      amount: 0,
      color: 'gray',
      legendFontColor: '#7F7F7F',
      legendFontSize: 10
    }
  ]);

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/currencies');
        if (!response.ok) {
          throw new Error('Failed to get currencies');
        }
        const data = await response.json();

        const formatData = data.map(currency => ({
          key: currency,
          value: currency
        }));
        setCurrencies(formatData);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrencies();
  }, []);


  
  const getBudget = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/budget');
      if (!response.ok) {
        throw new Error('failed to get budget');
      }
      const data = await response.json();
      setBudget(data.toFixed(2));
    }  catch (error) {
        console.error(error);
    }
  };


  const changeBudget = async () => {
      if (isNaN(convertedValue)) {
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/budget/set', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ convertedValue }),
        });

        if (!response.ok) {
            throw new Error('Failed to update budget');
        }

        setOriginalBudget(convertedValue)
        setModalVisibility(false);
        setHomeCurrency(toCurrency);
        getBudget();


    } catch (error) {
        console.error('Error:', error.message);
    }
  }


    useEffect(() => {
      const convertCurrency = async () => {
        
          try {
              if (!value) {
                setConvertedValue('');
                return;
              }

              const response = await fetch(`http://localhost:8080/api/convert?from_currency=${homeCurrency}&to_currency=${toCurrency}&value=${value}`);
              if (!response.ok) {
                  throw new Error('Failed to convert currency');
              }
              const data = await response.json();
              setConvertedValue(data.toFixed(2));
  
          
          } catch (error) {
              console.error(error);
          }
      };
      convertCurrency();
  }, [toCurrency, value]);


  const addExpense = async () => {
    if (isNaN(expenseCost) || expenseType === '') {
      setExpenseCost('');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/budget/subtract', {
        method: 'PUT',
        body: JSON.stringify({
          expenseCost
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      //console.log(expenseTypes)
      let updatedList = expenseTypes.map(expense => {
        if (expense.name === expenseType) {
          return {...expense, amount: expense.amount + Number(expenseCost)}
        }
        return expense
      });

      setExpenseTypes(updatedList);
      //console.log(expenseTypes)
      getBudget();
      toggleExpenseModal(false);
      setExpenseCost('');



    } catch (error) {
      console.log('Error:' + error.message);
    }
  }

      
  return (
    <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.budgetContainer}>
          <View style={styles.rowWrapper}>
            <Text style={{fontWeight: 'Bold', fontSize: 45}} onPress={() => setModalVisibility(true)}>
              {budget}
            </Text>

            <Text style={{color:'gray', fontSize: 20}}>
              /{originalBudget} {toCurrency}
            </Text>
            
          </View>
          <ProgressBar progress={originalBudget > 0 ? (originalBudget - budget) / originalBudget : 0}></ProgressBar>

        </View>

        <View style={styles.expenseContainer}>
          <Text style={styles.expenseTitle}>
            Expenses
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0}}>
            <Button color='grey' title="+" onPress={() => toggleExpenseModal(true)}></Button>
          </View>

            <PieChart
              data={expenseTypes}
              width={300}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[2, 5]}
            />

        </View>


        <Modal visible={isModalVisible} transparent={true}>
          <View style={styles.modalMargin}>
            <View style={styles.modalContent}>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight:'bold', fontSize: 20, marginBottom: 10}}>
                Update Budget?
              </Text>
              <Button color='gray' title="X" onPress={() => setModalVisibility(false)}/>
              </View>

              <View style={styles.divider} />

              <View style={{flexDirection:"row",justifyContent: 'Center', marginVertical: 15}}>
                <SelectList
                data={currencies_arr}
                setSelected={setHomeCurrency}
                save="key"
                dropdownTextStyles={{color:'black'}}
                dropdownStyles={{backgroundColor:'white'}} 
                boxStyles={{borderRadius:2, backgroundColor: 'white'}}
                defaultOption={{ key:homeCurrency, value: homeCurrency}}
                />
                <TextInput
                  style={styles.modalInput}
                  onChangeText={setValue}
                  placeholder= {originalBudget}
                  placeholderTextColor="grey"
                  keyboardType="numeric"
                  value={value}
                />
              </View>

              <View style={{flexDirection:"row",justifyContent: 'Center', marginVertical: 15}}>
                <SelectList
                data={currencies_arr}
                setSelected={setToCurrency}
                save="key"
                dropdownTextStyles={{color:'black'}}
                dropdownStyles={{backgroundColor:'white'}} 
                boxStyles={{borderRadius:2, backgroundColor: 'white'}}
                defaultOption={{ key:toCurrency, value:toCurrency}}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder= "Travel Currency Amount"
                  placeholderTextColor="grey"
                  value={convertedValue}
                  editable={false}
            />
              </View>

              <View style={styles.divider} />

              <View>
                <Button title="Submit" color="black" onPress={changeBudget}/>
              </View>
          </View>
          </View>
        </Modal>


        <Modal visible={expenseModal} transparent={true}>
              <View style={styles.modalMargin}>
            <View style={styles.modalContent}>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight:'bold', fontSize: 20, marginBottom: 10}}>
                Add an Expense
              </Text>
              <Button color='gray' title="X" onPress={() => toggleExpenseModal(false)}/>
              </View>

              <View style={styles.divider} />

              <View style={{flexDirection:"row",justifyContent: 'Center', marginVertical: 15}}>
                <SelectList
                  data={expenseTypes.map((expense) => ({ key: expense.name, value: expense.name }))}
                  setSelected={setExpenseType}
                  save="key"
                  dropdownTextStyles={{color:'black'}}
                  dropdownStyles={{backgroundColor:'white'}} 
                  boxStyles={{borderRadius:2, backgroundColor: 'white'}}
                  placeholder='Expense Type'

                />
                <TextInput
                  style={styles.modalInput}
                  onChangeText={setExpenseCost}
                  placeholder='Cost'
                  placeholderTextColor="grey"
                  keyboardType="numeric"
                  value={expenseCost}
                />
              </View>

              <View style={styles.divider} />

              <View>
                <Button title="Submit" color="black" onPress={addExpense}/>
              </View>
          </View>
          </View>
        </Modal>
        
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  modalMargin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
    
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: 450
  },
  modalInput: {
    borderWidth: 2,
    padding: 10,
    width: 200,
    marginRight: 10,
    borderColor: 'gray'
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical:10,
    width: '100%',
  },
  budgetContainer: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 5,
    width: 350,
    marginTop: 60,
    alignItems:'center'
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems:'flex-end',
    marginBottom: 10,
  },
  expenseContainer: {
    backgroundColor: 'white',
    padding: 100,
    borderRadius: 5,
    width: 350,
    margin: 5,
    alignItems:'center'
  },
  expenseTitle: {
    fontSize: 30, 
    fontWeight: 'Bold', 
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    flexDirection:'row',
    justifyContent: 'space-between'
    
  }
  

});

export default Budget;
