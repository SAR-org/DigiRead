import React from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import {NavigationEvents} from "react-navigation";
 
//import Pdf from 'react-native-pdf';

const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
class WishList_bk extends React.Component {
 
  render(){
    return (
      <View style={styles.container}>
        <Text>This is Library Wish List</Text>
      </View>
    ); 
    
  //   return (
  //     <View style={styles.container}>
  //     <Pdf
  //         source={source}
  //         onLoadComplete={(numberOfPages,filePath)=>{
  //             console.warn(`number of pages: ${numberOfPages}`);
  //         }}
  //         onPageChanged={(page,numberOfPages)=>{
  //             console.warn(`current page: ${page}`);
  //         }}
  //         onError={(error)=>{
  //             console.warn(error);
  //         }}
  //         onPressLink={(uri)=>{
  //             console.warn(`Link presse: ${uri}`)
  //         }}
  //         style={styles.pdf}/>
  // </View>
    // )
  }
  
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});

export default WishList_bk;