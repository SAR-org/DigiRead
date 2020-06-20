import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import LibraryHome from '../screens/libraryHome';
import Book from '../screens/book';
import Header from '../shared/header';
import BookViewHeader from '../shared/bookViewHeader';
import LinearGradient from 'react-native-linear-gradient';

const screens = {
    LibraryHome : {
        screen : LibraryHome,
        navigationOptions : ({navigation})=>{

            return{
                headerTitle : ()=> <Header 
                headerText='DigiRead'
                navigation={navigation}/>,
                headerBackground: ()=>
                    <LinearGradient
                      colors={['#F3527B', '#F9B3C5']}
                      style={{ flex: 1 }}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    />,
            }
            
        }
    },
    Book : {
        screen : Book,
        navigationOptions : ({navigation})=>{
            return{
                headerTitle : ()=> <BookViewHeader 
                headerText={navigation.getParam('bookDisplayName', '')}
                thisBookId = {navigation.getParam('bookId')} 
                downloadUri = {navigation.getParam('downloadUri')}
                favouriteBookArr = {navigation.getParam('favouriteBookArr')}
                isThisBookFav = {navigation.getParam('isThisBookFav')}
                isDarkBg = {navigation.getParam('isDarkBg')}
                navigation={navigation}/>,
                headerBackground: ()=>
                    <LinearGradient
                      colors={!navigation.getParam('isDarkBg')?['#F3527B', '#F9B3C5']:['#202120', '#454745']}
                      style={{ flex: 1 }}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                    />,
            }
            
        }

    },
}

const bookLibraryStack = createStackNavigator(screens,{
    defaultNavigationOptions : {
        headerTintColor : '#444',
        headerStyle : {backgroundColor : '#eee',height : Platform.OS=='ios'?90:60},
	//safeAreaInsets: { top: 40}
    }
});

export default createAppContainer(bookLibraryStack);
