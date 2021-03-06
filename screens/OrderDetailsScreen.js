import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { withBadge } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import Card from '../components/Card';
import { FlatList } from 'react-native-gesture-handler';


const OrderDetailsScreen = props => {
  const orderId = props.navigation.getParam('orderId');
  const selectedOrder = useSelector(state =>
    state.orders.orders.find(order => order.id === orderId)
  );
  const totalItems = useSelector(state => state.cart.totalItems);


  useEffect(() => {
    props.navigation.setParams({totalItemsCount: totalItems});
  }, [totalItems]);

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#f5e296', '#926b14']} style={styles.gradient}>
        <ScrollView>  
          <Card style={styles.dataContainer}>
            <Text style={styles.products}>Produse: </Text>
            <FlatList
              style={styles.list}
              data={selectedOrder.items}
              keyExtractor={item => item.productTitle}
              renderItem={
                itemData => (
                  <View style={styles.card}>
                    <View style={styles.itemDataContainer}>
                      <View><Text>{itemData.item.productTitle}</Text></View>
                      <View><Text> x </Text></View>
                      <View><Text>{itemData.item.quantity}</Text></View>
                    </View>
                    <View><Text style={styles.price}>= {itemData.item.sum}</Text></View>
                  </View>
                )}
            />
            <Text style={styles.description}> Total: {selectedOrder.totalAmount}</Text>
          </Card>
          <Card style={styles.dataContainer}>
            <Text style={styles.products}>Date livrare: </Text>
            <Text style={styles.shipping}>Nume: {selectedOrder.shippingName}</Text>
            <Text style={styles.shipping}>Nr. de telefon: {selectedOrder.shippingPhone}</Text>
            <Text style={styles.shipping}>Localitate: {selectedOrder.shippingCity}</Text>
            <Text style={styles.shipping}>Judet: {selectedOrder.shippingCounty}</Text>
            <Text style={styles.shipping}>Adresa: {selectedOrder.shippingAddress}</Text>
          </Card>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1
  },
  products: {
    fontSize: 18,
    textAlign: 'center'
  },
  dataContainer: {
    padding: 8,
    margin: 8,
  },
  list: {
    marginTop: 16,
    borderBottomColor: '#08292F',
    borderBottomWidth: 0.5
  },
  price: {
    textAlign: 'right'
  },
  card: {
    marginBottom: 16,
  },
  itemDataContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    // fontFamily: 'open-sans',
    fontSize: 16,
    textAlign: 'right',
    marginVertical: 16
  },
  shipping: {
    marginVertical: 8
  }
});

OrderDetailsScreen.navigationOptions = navData => {
  let itemsCount = navData.navigation.getParam('totalItemsCount');
  const ItemsCart = withBadge(itemsCount, {
    bottom: 0,
    right: 0,
    badgeStyle: {
      backgroundColor: Colors.accent
    }
  })(HeaderButton);
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={(itemsCount == 0) ? HeaderButton : ItemsCart}>
        <Item
          style={styles.cart}
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default OrderDetailsScreen;
