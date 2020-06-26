/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import RootDrawerNavigator from './route/LibraryDrawer';
import Splash from './screens/splash';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

class App extends React.Component{

  arrayholder = [];
  state = {
    appNotReady: false,
    fontIsLoaded: false,
    favouriteBookIds: [],
    recentlyPublishedBooks: [],
    books: [],
    categorisedBooks: [],
  };

  componentDidMount(){
    this.prepareResources();
  }

  prepareResources = async () => {
    await this.performAPICalls();
    await this.downloadAssets();
  };

  performAPICalls() {
    this.getAllBooks();
    this.getRecentlyPublishedBooks();
  }
  downloadAssets() {
    this.getFavoriteBookConfigs();
  }

  getFavoriteBookConfigs = async () => {

    AsyncStorage.getItem('myAppConfigsTest').then((value) => {

      if (value != null) {
        var configJson = JSON.parse(value);
        this.setState({ favouriteBookIds: configJson.favorite });
      }
    });
  }

  getRecentlyPublishedBooks = () => {

    axios.get('https://mobilerading.000webhostapp.com/digiread/api/book/recentlypublishedbooks.php')
      .then(res => {

        const recentlyPublishedBooks = res.data;
        this.setState({ recentlyPublishedBooks: recentlyPublishedBooks,});
      }).catch(function (error) {
        this.setState({appNotReady:true});
        //console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;

      });
  }

  getAllBooks = () => {
    axios.get('https://mobilerading.000webhostapp.com/digiread/api/book/allbooks.php')
      .then(res => {
        const books = res.data;

        this.setState({ books: books });
        this.arrayholder = books;

        let dataSource = books.reduce(function (sections, item) {

          let section = sections.find(section => section.category_name === item.category_name);

          if (!section) {
            section = { category_name: item.category_name, category_id: item.category_id, data: [] };
            sections.push(section);
          }

          section.data.push(item);

          return sections;
        }, []);
        this.setState({
          categorisedBooks: dataSource
        });

      }).catch(function (error) {
        this.setState({appNotReady:true})
        //console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;

      });
  }

  render(){
    //global.currentScreenIndex = 0;
      return(
        <View style={styles.container}>
        < AppContainer screenProps={{
          favouriteBookIds: this.state.favouriteBookIds,
          recentlyPublishedBooks: this.state.recentlyPublishedBooks,
          books: this.state.books,
          categorisedBooks: this.state.categorisedBooks,
          handler : this.handler,
        }} />
        </View>
      );
    
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  'Splash' : {screen : Splash},
  'Drawer' : {screen : RootDrawerNavigator}
  },
  {
  initialRouteName : 'Splash' // Telling the navigator that the first       
  // route is Splash screen
  })

const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container : {
    flex :1,
    height : Dimensions.get('screen').height,
    width : Dimensions.get('screen').width,
    //justifyContent : 'center',
    //alignItems : 'center',
  }
})

export default App;
