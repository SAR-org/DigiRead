import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


class Splash extends React.Component {

  async componentDidMount() {
    // You can load api data or any other thing here if you want
    const data = await this.navigateToHome();
    if (data !== null) {
      this.props.navigation.navigate('Home');
    }
      
  }
  navigateToHome = async () => {
    // Splash screen will remain visible for 2 seconds
    const wait = time => new Promise((resolve) => setTimeout(resolve, time));
    return wait(3000).then(() => this.props.navigation.navigate('Home'))
  };
  render() {
    //console.warn("====>>>"+this.props.appIsReady)
    // if(this.props.appNotReady){
    //   Alert.alert("Apologies","DigiRead is experiencing high traffic, App will be back shortly");
    // }
    return (
      
      <LinearGradient
        colors={['#E77A97', '#F3527B', '#E77A97']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
          <StatusBar hidden /> 
          <View style={{height: 200,alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/icons/icon2.png')} style={{height: 200, width:200,resizeMode:'contain'}}></Image>
            </View>
        <Text style={styles.splashText}>D-Read</Text>
        {/* {this.props.appIsReady !='undefined' && !this.props.appIsReady && <Text style={styles.networkError}>Apologies, DigiRead is experiencing high traffic, App will be back shortly</Text>} */}
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height : Dimensions.get('window').height,
  },
  splashText: {
    //color: '#64A0EA',
    color: 'white',
    fontSize: 40,
    elevation: 5,
    shadowColor: '#333',
    fontFamily: 'CinzelDecorative-Black',
  },
  networkError : {
    fontSize : 16,
    color: 'white',
    alignItems : 'center',
    justifyContent : 'center',
    textAlign: 'center', 
  }
});

export default Splash;