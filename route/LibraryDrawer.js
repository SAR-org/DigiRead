import React from 'react';
import {createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import {createAppContainer, SafeAreaView} from 'react-navigation';
import {Dimensions,Image,View,Text,ScrollView} from 'react-native';

import bookLibraryStack from './booklibrarystack';
import wishlistLibrarystack from './wishlistLibrarystack';
import aboutyStack from './aboutStack';
import reviewAndHelpStack from './reviewAndHelpStack';
import { Icon } from 'react-native-elements';


const RootDrawerNavigator = createDrawerNavigator({
    Home : {
        screen : bookLibraryStack,
        navigationOptions: {
            drawerLabel: 'DigiRead Home',
            drawerIcon: (
                <Icon name='home' size={25} color="#808080" />
            ),
          },
    },
    Wishlist : {
        screen : wishlistLibrarystack,
        navigationOptions: {
            drawerLabel: 'Wish List',
            drawerIcon: (
                <Icon name='favorite' size={25} color="#808080" />
            ),
          },
    },
    About : {
        screen : aboutyStack,
        navigationOptions: {
            drawerLabel: 'What is DigiRead?',
            drawerIcon: (
                <Icon name='help' size={25} color="#808080" />
            ),
          },
    },
    ReviewUs : {
        screen : reviewAndHelpStack,
        navigationOptions: {
            drawerLabel: 'Review Us',
            drawerIcon: (
                <Icon name='help' size={25} color="#808080" />
            ),
          },
    },
},
{
    contentComponent: (props) => (
        <SafeAreaView style={{flex : 1}}>
            <View style={{height: 160,alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/icons/icon1.png')} style={{height: 160, width:200}}></Image>
            </View>
          <ScrollView>
            <DrawerItems {...props} />
          </ScrollView>
        </SafeAreaView>
       ),
    drawerWidth: 2*Dimensions.get('window').width/3,
});

export default createAppContainer(RootDrawerNavigator);