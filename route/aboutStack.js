import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import About from '../screens/about';
import Header from '../shared/header';
import LinearGradient from 'react-native-linear-gradient';

const screens = {
    About : {
        screen : About,
        navigationOptions : ({navigation})=>{
            return{
                headerTitle : ()=> <Header 
                headerText={'About DigiRead'} 
                navigation={navigation}/>,
                headerBackground: ()=><LinearGradient
                      colors={['#F3527B', '#F9B3C5']}
                      style={{ flex: 1 }}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    />,
            }
            
        }
    },
}

const aboutyStack = createStackNavigator(screens,{
    defaultNavigationOptions : {
        headerTintColor : '#444',
        headerStyle : {backgroundColor : '#eee',height : Platform.OS=='ios'?90:60}
    }
});

export default createAppContainer(aboutyStack);
