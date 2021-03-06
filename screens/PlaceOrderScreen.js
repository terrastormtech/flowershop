import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, KeyboardAvoidingView, Button, Text, Alert, Picker } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as data from '../data/judete.json';


import * as orderActions from '../store/actions/orders';
import * as cartActions from '../store/actions/cart';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
  };



const PlaceOrderScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [county, setCounty] = useState();
    const [billingCounty, setBillingCounty] = useState();
    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.items);
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const user = useSelector(state => state.user.user);

    const countyData = [];
    for (const key in data.judete) {
      countyData.push(data.judete[key].nume);
    }

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          billingName: '',
          billingEmail: '',
          billingPhone: '',
          billingCounty: '',
          billingCity: '',
          billingAddress: '',
          shippingName: '',
          shipppingPhone: '',
          shippingCity: '',
          shippingAddress: ''
        },
        inputValidities: {
          billingName: '',
          billingEmail: '',
          billingPhone: '',
          billingCounty: '',
          billingCity: '',
          billingAddress: '',
          shippingName: '',
          shipppingPhone: '',
          shippingCity: '',
          shippingAddress: ''
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
          Alert.alert('A avut loc o eroare!', error, [{ text: 'In regula' }]);
        }
      }, [error]);

    const placeOrderHandler = async () => {
      try {
        setIsLoading(true);
        await dispatch(orderActions.addOrder(
          cartItems,
          cartTotalAmount,
          formState.inputValues.billingName,
          formState.inputValues.billingEmail,
          formState.inputValues.billingPhone,
          billingCounty,
          formState.inputValues.billingCity,
          formState.inputValues.billingAddress,
          formState.inputValues.shippingName,
          formState.inputValues.shipppingPhone,
          county,
          formState.inputValues.shippingCity,
          formState.inputValues.shippingAddress
        ));
        setIsLoading(false);
        props.navigation.navigate('ProductsOverview');
      } catch (err) {
        setError(err.message);
      }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );

      // if (isLoading) {
      //   return (
      //     <View style={styles.centered}>
      //       <ActivityIndicator size='large' color={Colors.primary} />
      //     </View>
      //   );
      // }

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
          <ScrollView style={styles.orderContainer}>
                <View style={styles.orderContainer}>  
                      <View style={styles.centered}><Text>Date facturare:</Text></View> 
                        <Input
                           id="billingName"
                           label="Nume"
                           keyboardType="default"
                           required
                           autoCapitalize="words"
                           errorText="Introdu numele tau."
                           onInputChange={inputChangeHandler}
                           initialValue=''
                        />
                        <Input
                            id="email"
                            label="Adresa de E-mail"
                            keyboardType="email-address"
                            required
                            autoCapitalize="none"
                            errorText="Introdu o adresa de email valida."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <Input
                            id="billingPhoneNumber"
                            label="Numar de Telefon"
                            keyboardType="number-pad"
                            required
                            minLength={8}
                            autoCapitalize="none"
                            errorText="Introdu un numar de telefon valid."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                         <View style={styles.countyContainer}>
                          <Text>Judet </Text>
                          <Picker
                              style={styles.countyPicker}
                              mode="dropdown"
                              selectedValue={billingCounty}
                              onValueChange={(billingCounty)=> {
                                setBillingCounty(billingCounty);
                              }}
                            >
                              {countyData.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index}/>) 
                              })}
                            </Picker>
                        </View>
                        <Input
                              id="billingTown"
                              label="Localitate"
                              keyboardType="default"
                              required
                              autoCapitalize="words"
                              errorText="Introdu localitatea."
                              onInputChange={inputChangeHandler}
                              initialValue=''
                          />
                          <Input
                              id="billingAddress"
                              label="Adresa"
                              keyboardType="default"
                              required
                              placeholder="Strada, numar, alte detalii..."
                              autoCapitalize="none"
                              errorText="Introdu o adresa valida."
                              onInputChange={inputChangeHandler}
                              initialValue=''
                          />
                        
                        <View style={styles.centered}><Text>Date livrare:</Text></View> 

                        <Input
                           id="shippingName"
                           label="Nume"
                           keyboardType="default"
                           required
                           autoCapitalize="words"
                           errorText="Introdu numele tau."
                           onInputChange={inputChangeHandler}
                           initialValue=''
                        />
                          <Input
                            id="shipppingPhone"
                            label="Numar de Telefon"
                            keyboardType="number-pad"
                            required
                            minLength={8}
                            autoCapitalize="none"
                            errorText="Introdu un numar de telefon valid."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <View style={styles.countyContainer}>
                          <Text>Judet </Text>
                          <Picker
                              style={styles.countyPicker}
                              mode="dropdown"
                              selectedValue={county}
                              onValueChange={(county)=> {
                                setCounty(county);
                              }}
                            >
                              {countyData.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index}/>) 
                              })}
                            </Picker>
                        </View>
                        <Input
                              id="shippingCity"
                              label="Localitate"
                              keyboardType="default"
                              required
                              autoCapitalize="words"
                              errorText="Introdu localitatea."
                              onInputChange={inputChangeHandler}
                              initialValue=''
                          />
                          <Input
                              id="shippingAddress"
                              label="Adresa"
                              keyboardType="default"
                              required
                              placeholder="Strada, numar, alte detalii..."
                              autoCapitalize="none"
                              errorText="Introdu o adresa valida."
                              onInputChange={inputChangeHandler}
                              initialValue=''
                          />
       
                        <View style={styles.orderSummary}>
                          <Text style={styles.orderSummaryText}>Total de plata: {Math.round(props.navigation.getParam('totalAmount') * 100) / 100} RON</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            {isLoading ? ( 
                              <ActivityIndicator size='small' color={Colors.primary} />
                            ) : 
                            (<Button 
                              title={"Plateste"} 
                              color={Colors.primary} 
                              onPress={() => {
                                placeOrderHandler();
                              }} 
                            />)}
                        </View>   
                    
                </View>
              </ScrollView>
        </KeyboardAvoidingView>
       
    );
};

PlaceOrderScreen.navigationOptions = {
    headerTitle: 'Trimite Comanda'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center'
    },
    orderContainer: {
        width: '100%',
        paddingHorizontal: 10
    },
    orderSummary: {
      flex: 1,
      alignItems: 'center',
      marginTop: 20
    },
    buttonContainer: {
        marginVertical: 16
    }, 
    orderSummaryText: {
      fontSize: 20
    },
    countyContainer: {
      marginTop: 10
    },
    countyPicker: {
      padding: 0
    }, 
    centered: {
      flex: 1,
      marginVertical: 8,
      alignItems: 'center',
      justifyContent: 'center'
    }
});

export default PlaceOrderScreen;
