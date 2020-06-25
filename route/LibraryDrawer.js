import React from 'react';
import {createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import {createAppContainer, SafeAreaView} from 'react-navigation';
import {Dimensions,Image,View,Text,ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import bookLibraryStack from './booklibrarystack';
import wishlistLibrarystack from './wishlistLibrarystack';
import aboutyStack from './aboutStack';
import declarationStack from './declarationStack';
import reviewAndHelpStack from './reviewAndHelpStack';
import { Icon } from 'react-native-elements';


const RootDrawerNavigator = createDrawerNavigator({
    Home : {
        screen : bookLibraryStack,
        navigationOptions: {
            drawerLabel: 'D-Read Home',
            drawerIcon: (
                <Icon name='home' size={25} color="#F3527B" />
            ),
          },
    },
    Wishlist : {
        screen : wishlistLibrarystack,
        navigationOptions: {
            drawerLabel: 'Wish List',
            drawerIcon: (
                <Icon name='favorite' size={25} color="#F3527B" />
            ),
          },
    },
    About : {
        screen : aboutyStack,
        navigationOptions: {
            drawerLabel: 'What is D-Read?',
            drawerIcon: (
                <Icon name='help' size={25} color="#F3527B" />
            ),
          },
    },
    ReviewUs : {
        screen : reviewAndHelpStack,
        navigationOptions: {
            drawerLabel: 'Feedback',
            drawerIcon: (
                <Icon name='email' size={25} color="#F3527B" />
            ),
          },
    },
    Declaration : {
        screen : declarationStack,
        navigationOptions: {
            drawerLabel: 'Declaration & disclaimer',
            drawerIcon: (
                <Icon name='feedback' size={25} color="#F3527B" />
            ),
          },
    },
},
{
    contentComponent: (props) => (
        <SafeAreaView style={{flex : 1}}>
            <View style={{height: 160,alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/icons/icon2.png')} style={{height: 150, width:200,resizeMode:'contain'}}></Image>
            </View>
          <ScrollView>
            <DrawerItems {...props} />
          </ScrollView>
        </SafeAreaView>
       ),
    drawerWidth: 2*Dimensions.get('window').width/3,
});

export default createAppContainer(RootDrawerNavigator);
