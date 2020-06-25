import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Card from '../shared/card'
import CardList from '../shared/cardlist';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation  from 'react-native-vector-icons/Foundation';
import  MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationEvents} from "react-navigation";
import LinearGradient from 'react-native-linear-gradient';

const ScreenWidth = Dimensions.get("window").width;

class WishList extends React.Component {

    state = {
        favouriteBookIds:[],
        books: [],
        listViewActionBgColor : '#fff',
        gridViewActionBgColor : '#fff',
        displayModeIconColor : '#99062C',
        numberOfColumnsDisplay : '',
        displayItemWidth : (ScreenWidth - 40) / 2 - 20,
        viewStyleAtLastBookView : 'grid',
        numOfColumnInGrid : Math.floor((ScreenWidth-40)/90),
        gridItemWidth : (ScreenWidth - 10) /3 - 20,
      }

      componentDidMount(){
        this.setState({displayItemWidth:this.state.gridItemWidth});
      }

    getFavBooks=async()=> {

      await this.getFavoritePvtConfigs();
      var favoriteQueryId = this.state.favouriteBookIds;

      if (! favoriteQueryId){
        favoriteQueryId = favoriteQueryId.toString();
      }
       
      if(favoriteQueryId!=''){
        var api = 'https://mobilerading.000webhostapp.com/digiread/api/book/booksforids.php?ids='
        +favoriteQueryId
        axios.get(api)
          .then(res => {
            const books = res.data;
            this.setState({ books: books });
          }).catch(function (error){
            Alert.alert("Apologies","DigiRead is experiencing high traffic, App will be back shortly")
          })
      }else{
        this.setState({ books: [] });
      }

      if(this.state.viewStyleAtLastBookView =='grid'){
        this.gridViewDisplay();
      }else{
        this.listViewDisplay();
      }
      
        
      }

      getFavoritePvtConfigs = async() => {
        await AsyncStorage.getItem('myAppConfigsTest').then((value) => {
          if (value != null) {
            var configJson = JSON.parse(value);

            this.setState({ favouriteBookIds: configJson.favorite });
          }
        });
      }


    viewBook = (book) => {
        
            this.props.navigation.navigate('Book',
            {book:book,favouriteBookIds:this.state.favouriteBookIds});
        
    }

  renderItems = ({ item }) => (
    <Card>
    <TouchableOpacity onPress={()=>this.viewBook(item)}>
    <View style={{ width : this.state.displayItemWidth,...styles.item}} >
      {/* <Text style={styles.title}>{item.displayName}</Text> */}
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      {/* <Text style={styles.sublabel}>Read count : </Text> */}
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
              {/* <MaterialCommunityIcons name="file-download" size={13} color="green" /> */}
              <Entypo name="download" size={13} color="green" />
              <Text style={styles.sublabel}> : {item.download_count}</Text>
            </View>
            
          </View>
      
    </View>
    
    </TouchableOpacity>
    </Card>
  );

  renderListStyleItems = ({ item }) => (
    <CardList>
      <TouchableOpacity onPress={() => this.viewBook(item)}>
        <View style={{ width: this.state.displayItemWidth, ...styles.listItem }} >
          <Image source={{ uri: item.imageUrl }} style={styles.imageInList} />
          <View style={styles.bookDetailsInListViewStyle}>
          <View style={styles.sublabelListContainer}>
              <Text style={styles.titleLabel}>Book Name : </Text>
              <Text 
              style={styles.title}>{item.displayName}</Text>
          </View>
          <View style={styles.sublabelListContainer}>
              <Text style={styles.titleLabel}>Author : </Text>
              <Text style={styles.title}>{item.author}</Text>
          </View>
          <View style={styles.sublabelListContainer}>
              <Text style={styles.titleLabel}>Language : </Text>
              <Text style={styles.title}>{item.language}</Text>
          </View>
          <View style={{...styles.sublabelListContainer,paddingRight : 10}}>
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

        </View>

      </TouchableOpacity>
    </CardList>
  );

  renderGridStyleBooks = ()=> {
      return (
        <FlatList
          data={this.state.books}
          renderItem={this.renderItems}
          keyExtractor={item => item.id}
          numColumns={this.state.numOfColumnInGrid}
        />
      );
    
  }

  renderListStyleBooks = ()=> {
    return (
      <FlatList
        data={this.state.books}
        renderItem={this.renderListStyleItems}
        keyExtractor={item => item.id}
        numColumns={1}
      />
    );
  
}

  listViewDisplay = ()=>{
    this.setState({listViewActionBgColor : '#BB8E9A',
    gridViewActionBgColor : '#fff',
    viewStyleAtLastBookView:'list',
    numberOfColumnsDisplay : 1,
    displayItemWidth : ScreenWidth - 20})
  }

  gridViewDisplay = ()=>{
    this.setState({gridViewActionBgColor : '#BB8E9A',
    listViewActionBgColor : '#fff',
    viewStyleAtLastBookView:'grid',
    numberOfColumnsDisplay : this.state.numOfColumnInGrid,
    displayItemWidth : this.state.gridItemWidth})
  }

  renderActionBar = ()=>{
    return (
    // <View style={styles.actionBarStyle}>
     <LinearGradient
         colors={['#F3527B', '#F9B3C5']}
         start={{x: 0, y: 0}}
         end={{x: 1, y: 0}}
         style={styles.actionBarStyle}
         > 
      <TouchableOpacity style={{backgroundColor : this.state.gridViewActionBgColor,...styles.gridViewActionStyle}}
      onPress = {this.gridViewDisplay}>
        <MaterialCommunityIcons 
        name="view-grid" 
        size={24} 
        color={this.state.displayModeIconColor} />
      </TouchableOpacity>
      <TouchableOpacity 
      style={{backgroundColor : this.state.listViewActionBgColor,...styles.listViewActionStyle}}
      onPress = {this.listViewDisplay}>
        <Foundation 
        name="list" 
        size={24} 
        color={this.state.displayModeIconColor}/>
      </TouchableOpacity>
    </LinearGradient>
    //</View>
    );
  }


  render() {
    return (
      <View style={styles.container}>
          <NavigationEvents onDidFocus={()=>this.getFavBooks()} />
          {this.renderActionBar()}
          {this.state.numberOfColumnsDisplay ==this.state.numOfColumnInGrid && this.renderGridStyleBooks()}
          {this.state.numberOfColumnsDisplay ==1 && this.renderListStyleBooks()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10,
    backgroundColor : 'white',
    justifyContent : 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: "#fff",
    elevation : 5,
    shadowOffset : {width : 2, height : 2},
    shadowColor : '#333',
    shadowOpacity : 1,
    shadowRadius : 5,
    borderRadius : 6,
  },
  listItem : {
    //flex : 1,
    flexDirection : 'row',
    backgroundColor: "#fff",
    marginVertical: 2,
    marginHorizontal: 2
  },
  imageInList : {
    // alignItems : 'flex-start',
    // justifyContent : 'flex-start',
    flex : 2,
    resizeMode: 'contain', 
    borderRadius: 6,
    height: 110,
  },
  titleLabel : {
    fontWeight : 'bold',
    fontSize: 13,
    color: "#333",
    alignSelf: "center"
  },
  image : {
    borderRadius : 6,
    height : 90,
    resizeMode: 'contain',
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
  viewCountStyle : {
    flex : 1,
    flexDirection : 'row',
    justifyContent : 'flex-start'
  },
  favouriteCountStyle : {
    flex : 1,
    flexDirection : 'row',
    justifyContent: "center"
  },
  downloadCountStyle : {
    flex : 1,
    flexDirection : 'row',
    justifyContent : 'flex-end'
  },
  bookDetailsInListViewStyle : {
    paddingLeft : 5,
    flex : 3,
    flexDirection : 'column',
  },
  sublabelListContainer : {
    flexDirection: 'row',
    flexWrap: "wrap",
    paddingTop: 5,
  },
  sublabelContainer: {
    flexDirection: 'row',
    paddingTop: 5,

  },
  actionBarStyle : {
    width: ScreenWidth,
    padding : 10,
    flexDirection : 'row',
    justifyContent : 'flex-end',
    elevation : 5,
    backgroundColor : '#fff',
    shadowOffset : {width : 2, height : 2},
    shadowColor : '#333',
    shadowOpacity : 1,
    shadowRadius : 5,
  },
  listViewActionStyle : {
    borderWidth : 1,
    padding : 2,
    paddingLeft: 6,
    paddingRight : 6,
    marginHorizontal: 3,
    borderRadius : 4,
  },
  gridViewActionStyle : {
    borderWidth : 1,
    padding : 2,
    marginHorizontal: 3,
    borderRadius : 4,
  },
});


export default WishList