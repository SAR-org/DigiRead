import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  AsyncStorage,
  TextInput,
  Keyboard,
  StatusBar
} from 'react-native';

import Card from '../shared/card'
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation  from 'react-native-vector-icons/Foundation';
import  MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from "react-navigation";
import LinearGradient from 'react-native-linear-gradient';
//import * as Font from 'expo-font';

const ScreenWidth = Dimensions.get("window").width;

// let customFonts = {
//   'notoserif-bold' : require('../assets/fonts/NotoSerif-Bold.ttf'),
//   'notoserif-regular' : require('../assets/fonts/NotoSerif-Regular.ttf'),
// };

class LibraryHome extends React.Component {

  constructor(props) {
    super(props);
  }

  arrayholder = [];

  state = {
    fontsLoaded: false,
    renderCatView: true,
    books: [],
    categorisedBooks: [],
    recentlyPublishedBooks: [],
    isLoading: true,
    gridViewLoaded: true,
    error: null,
    searchText: '',
    favouriteBookIds: [],
    listViewActionBgColor: '#fff',
    gridViewActionBgColor: '#fff',
    displayModeIconColor: '#99062C',
    numberOfColumnsDisplay: '',
    displayItemWidth: (ScreenWidth - 40) / 2.5 - 20,
    didAppClosed : false,
  }

  // async loadFontsAsync() {
  //   await Font.loadAsync(customFonts);
  //   this.setState({ fontsLoaded: true });
  // }

  componentDidMount() {
    //this.clearStorage();
    //this.getFavoritePvtConfigs();
    
    //this.loadFontsAsync();
    this.setState({ gridViewActionBgColor: '#BBD6D6', 
                    numberOfColumnsDisplay: 2,
                    favouriteBookIds : this.props.screenProps.favouriteBookIds,
                    recentlyPublishedBooks: this.props.screenProps.recentlyPublishedBooks,
                    books : this.props.screenProps.books,
                    categorisedBooks : this.props.screenProps.categorisedBooks });

    //console.warn("Passed Value====>>"+this.props.screenProps.testVal);

    //this.reRenderUponOnFocusHome();

  }

  // componentDidUpdate(prevState){
  //   if(this.state.didAppClosed !== prevState.didAppClosed){
  //     console.warn("App was closed=====>>>");
  //   }
  // }
  // clearStorage = async()=>{
  //   console.warn("Clearing storage.......")
  //   AsyncStorage.clear('myAppConfigsTest');
  //   console.warn("Cleared!")
  // }




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


  viewBook = (book) => {
    this.props.navigation.navigate('Book',
      { book: book, favouriteBookIds: this.state.favouriteBookIds });

  }
  renderItems = ({ item }) => (
    <Card>
      <TouchableOpacity onPress={() => this.viewBook(item)}>
        <View style={{ width: this.state.displayItemWidth, ...styles.item }} >
          {/* <Text style={styles.title}>{item.displayName}</Text> */}
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.sublabelContainer}>
            <View style={styles.viewCountStyle}>
              <FontAwesome5 name="book-reader" size={13} color="#333" />
              <Text style={styles.sublabel}> : {item.view_count}</Text>
            </View>
            <View style={styles.favouriteCountStyle}>
              <MaterialIcons name="favorite" size={13} color="red" />
              <Text style={styles.sublabel}> : {item.favorite_count}</Text>
            </View>

            <View style={styles.downloadCountStyle}>
               <Entypo name="download" size={13} color="green" />
              <Text style={styles.sublabel}> : {item.download_count}</Text>
            </View>

          </View>

        </View>

      </TouchableOpacity>
    </Card>
  );

  renderItemsRecentlyReleased = ({ item }) => (
    <Card>
      <TouchableOpacity onPress={() => this.viewBook(item)}>
        <View style={{ width: this.state.displayItemWidth, ...styles.item }} >
          <Image source={{ uri: item.imageUrl }} style={styles.imageForRecentlyReleasedCont} />
        </View>

      </TouchableOpacity>
    </Card>
  );

  renderSearchBox = () => (
    <View style={styles.searchBarStyle}>
      <View style={styles.searchIcons}>
        <Ionicons name='ios-search' size={24} color='#99062C' />
      </View>

      <TextInput
        style={{ color: '#333', flex: 1, fontSize: 16, letterSpacing: 0.5 }}
        autoCapitalize='none'
        autoCorrect={true}
        onChangeText={(searchText) => this.handleSearch(searchText)}
        status='info'
        value={this.state.searchText}
        placeholder='Search ...'
        //style={{fontSize:17,alignItems:'flex-start' }}
        maxLength={50}
        onFocus={this.searchResultView}
      />
      <TouchableOpacity
        style={styles.searchIcons}
        onPress={() => this.handleSearch('')}>
        {!this.state.renderCatView && <Ionicons name="ios-close-circle" size={24} color="#99062C" />}
      </TouchableOpacity>

    </View>
  );

  searchResultView = () => {
    this.setState({ renderCatView: false });
    this.gridViewDisplay();
  }

  handleSearch = (searchText) => {
    this.setState({ searchText: searchText });
    if (searchText != '') {
      this.searchFilterFunction(searchText)
    }
    if (searchText == '') {
      Keyboard.dismiss();
      this.setState({ books: this.arrayholder, renderCatView: true });
      this.categoryViewDisplay();

    }
  }

  searchFilterFunction = (text) => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.displayName.toUpperCase()}
      ${item.category_name.toUpperCase()} ${item.author.toUpperCase()}
      ${item.language.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ books: newData });
  };

  searchForCategoryFromPane = (text) => {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.category_name.toUpperCase();

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ books: newData, renderCatView: false });
    //this.setState({renderCatView : false});
    this.gridViewDisplay();
  }

  renderGridStyleBooks = () => {
    return (
      <FlatList
        data={this.state.books}
        renderItem={this.renderItems}
        keyExtractor={item => item.id}
        initialNumToRender={5}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    );

  }

  renderListStyleBooks = () => {
    return (
      <FlatList
        data={this.state.books}
        renderItem={this.renderItems}
        keyExtractor={item => item.id}
        initialNumToRender={5}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    );

  }

  renderCategorisedView = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.categorisedBooks}
        renderItem={this.renderCategoryHeading}
        keyExtractor={item => item.category_id}
      />
    );

  }

  renderCategoryHeading = ({ item }) => {
    return (
      <View>
        <View style={styles.catHeaderBg}>
          <Text style={styles.categoryHeaderFont}>{item.category_name}</Text>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={item.data}
          renderItem={this.renderItems}
          keyExtractor={subitem => subitem.id}
        />
      </View>
    );
  }

  renderAllCategoryPane = () => {
    return (
      // <View style={styles.catSelectionPane}>
       <LinearGradient
         colors={['#F3527B', '#F9B3C5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.catSelectionPane}>
        <Text style={styles.allcategoryHeaderFont}>All Categories</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.state.categorisedBooks}
          renderItem={this.renderCategoryButton}
          keyExtractor={item => item.category_id}

        />
        </LinearGradient>
      //</View>
    );
  }

  renderRecentlyPublishedBooks = () => {
    return (
      <View style={styles.recentReleases}>
        <Text style={styles.categoryHeaderFont}>Recent Releases</Text>

        <FlatList
          horizontal
          data={this.state.recentlyPublishedBooks}
          renderItem={this.renderItemsRecentlyReleased}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}

        />
      </View>
    );
  }

  renderCategoryButton = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.searchForCategoryFromPane(item.category_name)}>
        <View style={styles.categoryInPane}>
          <Text style={styles.categoryPaneItem}>{item.category_name}</Text>
        </View>
      </TouchableOpacity>

    );
  }

  listViewDisplay = () => {
    this.setState({
      listViewActionBgColor: '#BBD6D6',
      gridViewActionBgColor: '#fff',
      numberOfColumnsDisplay: 1,
      displayItemWidth: ScreenWidth - 40,
      gridViewLoaded: false,
    })
  }

  gridViewDisplay = () => {
    this.setState({
      gridViewActionBgColor: '#BBD6D6',
      listViewActionBgColor: '#fff',
      numberOfColumnsDisplay: 2,
      displayItemWidth: (ScreenWidth - 10) / 2 - 20,
      gridViewLoaded: true,
    })
  }

  categoryViewDisplay = () => {
    this.setState({
      displayItemWidth: (ScreenWidth - 40) / 2.5 - 20
    });
  }

  renderActionBar = () => {
    return (
      
      // <View style={styles.actionBarStyle}>
       <LinearGradient
         colors={['#F3527B', '#F9B3C5']}
         start={{x: 0, y: 0}}
         end={{x: 1, y: 0}}
         style={styles.actionBarStyle}
         > 
        {this.renderSearchBox()}
        {!this.state.renderCatView && !this.state.gridViewLoaded && this.renderGridStyleButton()}
        {!this.state.renderCatView && this.state.gridViewLoaded && this.renderListStyleButton()}
        {!this.state.renderCatView && this.renderGoHomeButton()}
        </LinearGradient>
      // </View>
    
    );
  }

  renderGridStyleButton = () => {

    return (
      <TouchableOpacity style={styles.actionBarButtonStyle}
        onPress={this.gridViewDisplay}>
        <MaterialCommunityIcons
          name="view-grid"
          size={30}
          color={this.state.displayModeIconColor} />
      </TouchableOpacity>
    );
  }

  renderListStyleButton = () => {
    return (
      <TouchableOpacity
        style={styles.actionBarButtonStyle}
        onPress={this.listViewDisplay}>
        <Foundation
          name="list"
          size={30}
          color={this.state.displayModeIconColor} />
      </TouchableOpacity>
    );
  }

  renderGoHomeButton = () => {
    return (
      <TouchableOpacity
        style={styles.actionBarButtonStyle}
        onPress={() => this.handleSearch('')}>
        <MaterialCommunityIcons name="home" size={30} color="#99062C" />
      </TouchableOpacity>
    );
  }

  reRenderUponOnFocusHome = () => {

    this.getFavoriteBookConfigs();

    this.getRecentlyPublishedBooks();
    axios.get('https://mobilerading.000webhostapp.com/digiread/api/book/allbooks.php')
      .then(res => {
        const books = res.data;
        //console.warn("books====>>>"+JSON.stringify(books));
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
          isLoading: false,
          categorisedBooks: dataSource,
        });

      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;

      });

  }
  render() {

    //if (this.state.isLoading || !this.state.fontsLoaded) {
    // if (!this.state.fontsLoaded) {
    //   return (
    //     <View style={{ flex: 1, padding: 20,size:60,
    //     justifyContent:'center',alignItems:'center' }}>
    //       <ActivityIndicator size="large"/>
    //       {/* <AppLoading/> */}
    //     </View>
    //   )
    // }

    return (
      <View style={styles.container}>
        {/* <StatusBar hidden /> */}
        {/* <NavigationEvents onDidFocus={() => this.reRenderUponOnFocusHome()} /> */}
        <NavigationEvents onWillFocus={() => this.reRenderUponOnFocusHome()} />
        {this.renderActionBar()}
        {this.state.renderCatView && this.renderAllCategoryPane()}
        {this.state.renderCatView && this.renderRecentlyPublishedBooks()}
        {this.state.renderCatView && this.renderCategorisedView()}
        {!this.state.renderCatView && this.state.numberOfColumnsDisplay == 2
          && this.renderGridStyleBooks()}
        {!this.state.renderCatView && this.state.numberOfColumnsDisplay == 1
          && this.renderListStyleBooks()}
      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop : 0,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    //width: (ScreenWidth - 40) / 2 - 20,
    backgroundColor: "#fff",
    // paddingLeft: 2,
    // paddingRight: 2,
    marginVertical: 2,
    marginHorizontal: 2
  },
  image: {
    borderRadius: 6,
    height: 100,
  },

  imageForRecentlyReleasedCont: {
    borderRadius: 6,
    height: 70,
  },
  title: {
    fontSize: 15,
    color: "#333",
    alignSelf: "center"
  },
  sublabel: {
    fontSize: 10,
    color: "#333",

  },
  viewCountStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  favouriteCountStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center"
  },
  downloadCountStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  sublabelContainer: {
    flexDirection: 'row',
    paddingTop: 5,

  },
  actionBarStyle: {
    width: ScreenWidth,
    padding: 10,
    flexDirection: 'row',
    elevation: 5,
    backgroundColor: '#fff',
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  searchBarStyle: {
    borderColor: 'gray',
    marginRight: 5,
    //padding: 6,
    backgroundColor: '#F2F5F5',
    flex: 8,
    borderRadius: 15,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchIcons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  actionBarButtonStyle: {
    borderWidth: 0.5,
    marginHorizontal: 3,
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridViewActionStyle: {
    borderWidth: 0.5,
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryHeaderFont: {
    fontSize: 16,
    marginTop : 5,
    color: '#333',
    fontFamily : 'NotoSerif-Bold',

  },
  allcategoryHeaderFont : {
    fontSize: 16,
    marginBottom : 5,
    color: 'black',
    fontFamily : 'NotoSerif-Bold',
  },
  catHeaderBg: {
    flex: 1,
    flexDirection: 'row',
    padding: 3,
    //marginVertical : 10,
    width: ScreenWidth - 20,
    //backgroundColor: "#A1A7A7",
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 1,
    shadowRadius: 5,
    //borderWidth:0.5,
    //borderRadius : 5,
  },
  catSelectionPane: {
    //flex : 1,
    //flexDirection : 'row',
    padding: 5,
    paddingTop : 0,
    paddingLeft: 10,
    //marginVertical: 10,
    marginBottom : 10,
    width: ScreenWidth,
    backgroundColor: "#DCE1E1",
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 1,
    shadowRadius: 5,
    //borderWidth: 0.5,
    //borderRadius : 5,
  },
  categoryInPane: {
    borderWidth: 0.2,
    marginHorizontal: 3,
    backgroundColor: '#ECF3F3',
    padding: 2,
    borderRadius: 8,
    elevation: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#F3527B',
    shadowOpacity: 5,
    shadowRadius: 5,
  },
  categoryPaneItem: {
    fontSize: 10,
    fontFamily : 'NotoSerif-Regular',
    paddingLeft: 3,
    paddingRight : 3,
  },
  gohome: {
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 10,
  },
  recentReleases: {
    paddingLeft: 10,
    paddingTop: 5,
    //marginVertical : 10,
    width: ScreenWidth,
    backgroundColor: "#DCE1E1",
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 1,
    shadowRadius: 5,
    borderWidth: 0.5,
  },
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    //marginTop: Platform.OS == 'ios' ? 30 : 0,
  }
});


export default LibraryHome