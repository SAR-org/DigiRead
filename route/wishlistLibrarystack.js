import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import WishList from '../screens/wishlist';
import Book from '../screens/book';
import Header from '../shared/header';
import BookViewHeader from '../shared/bookViewHeader';
import LinearGradient from 'react-native-linear-gradient';

const screens = {
    WishList : {
        screen : WishList,
        navigationOptions : ({navigation})=>{
            return{
                headerTitle : ()=> <Header 
                headerText={'Wishlist'} 
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

const wishlistLibrarystack = createStackNavigator(screens,{
    defaultNavigationOptions : {
        headerTintColor : '#444',
        headerStyle : {backgroundColor : '#eee',height : Platform.OS=='ios'?90:60}
    }
});

export default createAppContainer(wishlistLibrarystack);
