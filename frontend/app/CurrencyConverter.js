import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const CurrencyConverter = () => {
    const [homeCurrency, setHomeCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [value, setValue] = useState('');
    const [convertedValue, setConvertedValue] = useState('');
    const [currencies_arr, setCurrencies] = useState([]);


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
    }, [homeCurrency, toCurrency, value]);


    return (
        <View>
          <View style={styles.rowWrapper}>

            <SelectList
              data={currencies_arr}
              setSelected={setHomeCurrency}
              save="key"
              dropdownTextStyles={{color:'black'}}
              dropdownStyles={{backgroundColor:'white'}}
              boxStyles={{borderRadius:2, backgroundColor: 'white'}} 
              defaultOption={{ key:'USD', value:'USD'}}
              />

            {/* <TextInput
              style={styles.input}
              onChangeText={setHomeCurrency}
              value={homeCurrency}
              placeholder="Home Currency"
              placeholderTextColor="#d3d3d3"
            /> */}
    
            <TextInput
              style={styles.input}
              onChangeText={setValue}
              placeholder= "Amount"
              placeholderTextColor="grey"
              value={value}
              keyboardType="numeric"
            />
          </View>
    
          <View style={styles.rowWrapper}>
            <SelectList
              data={currencies_arr}
              setSelected={setToCurrency}
              save="key"
              dropdownTextStyles={{color:'black'}}
              dropdownStyles={{backgroundColor:'white'}}
              boxStyles={{borderRadius:2, backgroundColor: 'white'}} 
              defaultOption={{ key:'EUR', value:'EUR' }}
              />
    
            <TextInput
              style={styles.input}
              placeholder= "Amount"
              placeholderTextColor="grey"
              value={convertedValue}
              editable={false}
            />
    
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
    rowWrapper: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      color: "#fff",
      marginRight: 10,
      borderWidth: 1,
      borderColor: 'white',
      padding: 10,
    },
  });
  

export default CurrencyConverter;
