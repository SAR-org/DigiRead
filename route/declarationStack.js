import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Declaration from '../screens/declaration';
import Header from '../shared/header';
import LinearGradient from 'react-native-linear-gradient';

const screens = {
    Declaration : {
        screen : Declaration,
        navigationOptions : ({navigation})=>{
            return{
                headerTitle : ()=> <Header 
                headerText={'Declaration'} 
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

const declarationStack = createStackNavigator(screens,{
    defaultNavigationOptions : {
        headerTintColor : '#444',
        headerStyle : {backgroundColor : '#eee',height : Platform.OS=='ios'?90:60}
    }
});

export default createAppContainer(declarationStack);
