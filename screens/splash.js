import React from 'react';
import {
  StyleSheet,
  Text,
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
    return wait(4000).then(() => this.props.navigation.navigate('Home'))
  };
  render() {
    
    return (
      
      <LinearGradient
        colors={['#E77A97', '#F3527B', '#E77A97']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
          <StatusBar hidden /> 
        <Text style={styles.splashText}>DigiRead</Text>
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
    color: '#64A0EA',
    fontSize: 40,
    elevation: 5,
    shadowColor: '#333',
    fontFamily: 'CinzelDecorative-Black',
  },
});

export default Splash;