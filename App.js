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
  Text,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
import RootDrawerNavigator from './route/LibraryDrawer';
import Splash from './screens/splash';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

class App extends React.Component{

  arrayholder = [];
  state = {
    appIsReady: false,
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
        this.setState({ recentlyPublishedBooks: recentlyPublishedBooks });

      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
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
          categorisedBooks: dataSource,
        });

      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;

      });
  }

  render(){
    //global.currentScreenIndex = 0;
    return(
      <View style={{ flex: 1 }}>
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
    justifyContent : 'center',
    alignItems : 'center',
  }
})

export default App;
