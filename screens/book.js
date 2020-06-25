import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Sound from 'react-native-sound';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { NavigationEvents } from "react-navigation";

const screenWidth = Dimensions.get("window").width;

class Book extends React.Component {


  currentPage = 1;
  pdf = null;

  state = {
    bookUri: '',
    bookDisplayName: '',
    totalPages: 1,
    currentPageDisplay: 1,
    modalVisible: false,
    isPageFlipAudioActive : true,
    isHorizontalFlipActive : true,
    isDarkBg : false,
    backGroundColor : 'white',
    activeReadModeColor : '#23CB18',
  }
  source = { uri: this.props.navigation.state.params.book.fileUri, cache: true };
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({ bookUri: params.book.fileUri });
    this.initBookDisplay(params.book.id, params.book.download_url, params.book.displayName, params.favouriteBookIds);

  }

  getPrivateDisplayPreferences = async () => {
    AsyncStorage.getItem('myAppConfigsTest').then((value) => {
      if (value != null) {
        var configJson = JSON.parse(value);
        this.setState({ isDarkBg: configJson.isBookDisplayDark });
        this.setState({ isHorizontalFlipActive: configJson.isFlipReadMode });
        this.setState({ isPageFlipAudioActive: configJson.isPageFlipeAudoActive });
        //console.warn(JSON.stringify(configJson));

        this.changeColor(configJson.isBookDisplayDark);
        this.controlPageFlipAudio(configJson.isPageFlipeAudoActive);
        this.changeReadingMode(configJson.isFlipReadMode);
      }else{
        this.changeColor(this.state.isDarkBg);
        this.controlPageFlipAudio(this.state.isPageFlipAudioActive);
        this.changeReadingMode(this.state.isHorizontalFlipActive);
      }
    });
    
  }

  savePrivateDisplayPreferences =async()=>{
    AsyncStorage.getItem('myAppConfigsTest').then((value) => {
      if (value != null) {
          var configJson = JSON.parse(value);
          configJson.isBookDisplayDark = this.state.isDarkBg;
          configJson.isFlipReadMode = this.state.isHorizontalFlipActive;
          configJson.isPageFlipeAudoActive =  this.state.isPageFlipAudioActive;

          AsyncStorage.setItem("myAppConfigsTest", JSON.stringify(configJson));
      } else {
          var configJson = this.getPrivateStorageJsonConfig();
          configJson.isBookDisplayDark = this.state.isDarkBg;
          configJson.isFlipReadMode = this.state.isHorizontalFlipActive;
          configJson.isPageFlipeAudoActive =  this.state.isPageFlipAudioActive;
          AsyncStorage.setItem("myAppConfigsTest", JSON.stringify(configJson));
      }

  });
  this.setModalVisible(false);
  }

  getPrivateStorageJsonConfig = () => {
    return { favorite: [], 
        isBookDisplayDark: false, 
        isFlipReadMode: true,
        isPageFlipeAudoActive : true}
}

  initBookDisplay = (bookId, downloadUri, bookDisplayName, favouriteBookIds) => {
    var that = this;
    // var headerLength = 15;
    // if (bookDisplayName.length > headerLength) {
    //   bookDisplayName = bookDisplayName.substring(0, headerLength - 1);
    // }

    that.props.navigation.setParams({
      'bookId': bookId,
      'downloadUri': downloadUri,
      'bookDisplayName': bookDisplayName,
      'favouriteBookArr': favouriteBookIds,
      'isThisBookFav': this.isThisBookFavourite(favouriteBookIds, bookId),
    });
    this.increaseBookViewCount(bookId);
  }

  changeColor = (isDark)=>{
    if(isDark){
      this.props.navigation.setParams({'isDarkBg' : isDark});
      this.setState({isDarkBg: isDark,backGroundColor : '#333'});
    }else{
      this.props.navigation.setParams({'isDarkBg' : isDark});
      this.setState({isDarkBg: isDark,backGroundColor : 'white'});
    }
    
  }

  increaseBookViewCount = (bookId) => {
    var api = 'https://mobilerading.000webhostapp.com/digiread/api/book/increaseviewcount.php?id=' + bookId;
    try {
      axios.get(api)
    } catch (e) {
      console.error(e);
    }
  }

  isThisBookFavourite = (favBookArr, bookId) => {
    for (id in favBookArr) {
      if (bookId == favBookArr[id]) {
        return true;
      }
    }
    return false;
  }

  playPageFlipAudio = () => {
    Sound.setCategory('Playback');
    const whoosh = new Sound('page_flip.wav', Sound.MAIN_BUNDLE, (error) => {

      if (error) {
        console.log('failed to load the sound', error);
        return;
      } else {
        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
            whoosh.reset();
          }
        });
      }
    });
  }
  controlPageFlipAudio = (shouldActivate)=>{
    this.setState({isPageFlipAudioActive : shouldActivate});
  }

  changeReadingMode = (isFlipModemode)=>{
    if(isFlipModemode){
      this.setState({isHorizontalFlipActive : true});
    }else{
      this.setState({isHorizontalFlipActive : false});
    }
  }

  goToNextPage = () => {
    this.currentPage++;
    this.pdf.setPage(this.currentPage);
    if(this.state.isPageFlipAudioActive){
      this.playPageFlipAudio();
    }
    
  }

  gotToPreviousPage = () => {
    this.currentPage--;
    this.pdf.setPage(this.currentPage);
    if(this.state.isPageFlipAudioActive){
      this.playPageFlipAudio();
    }
  }

  onSwipeUp(gestureState) {
    if(!this.state.isHorizontalFlipActive){
      this.goToNextPage();
    }
  }

  onSwipeDown(gestureState) {
    if(!this.state.isHorizontalFlipActive){
      this.gotToPreviousPage();
    }
  }

  onSwipeLeft(gestureState) {
    if(this.state.isHorizontalFlipActive){
      this.goToNextPage();
    }
  }

  onSwipeRight(gestureState) {
    if(this.state.isHorizontalFlipActive){
      this.gotToPreviousPage();
    }
  }

  changeCurrentPageNumber = (newPageNumber, numberOfPages) => {
    this.setState({ currentPageDisplay: newPageNumber, totalPages: numberOfPages });
  }

  renderTopActionBar = () => {
    return (
      <LinearGradient
        colors={['#F3527B', '#F9B3C5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topActionBarStyle}
      >
        <Text>This is Top</Text>
      </LinearGradient>
    );

  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  renderModal = () => {
    const { modalVisible } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerStyle}>
              <Text style={styles.modalHeaderText}>Customise Your Reading experience</Text>
            </View>

            <Text style={styles.modalText}>Reading Mode</Text>
            <View style={styles.settingHolderStyle}>
              <View style={styles.settingOptionStyle}>
                <Text style={styles.itemText}>Scroll down View </Text>
                <View style={styles.readModeIconStyle}>
                  <TouchableHighlight onPress={()=>this.changeReadingMode(false)}>
                  <FontAwesome5 name='scroll' size={30} 
                  color={!this.state.isHorizontalFlipActive?'#18B50E':'#B3B8B3'} />
                  </TouchableHighlight>
                </View>

              </View>
              <View style={styles.settingOptionStyle}>
                <Text style={styles.itemText}>Flip View </Text>
                <View style={styles.readModeIconStyle}>
                <TouchableHighlight onPress={()=>this.changeReadingMode(true)}>
                  <MaterialCommunityIcons name='book-open-page-variant' size={30}
                  color={this.state.isHorizontalFlipActive?'#18B50E':'#B3B8B3'} />
                </TouchableHighlight>
                </View>
              </View>
            </View>
            <Text style={styles.modalText}>Page Flip Audio</Text>
            <View style={styles.settingHolderStyle}>
              <View style={styles.settingOptionStyle}>
                <View style={styles.readModeIconStyle}>
                {!this.state.isPageFlipAudioActive && <TouchableHighlight onPress={()=>this.controlPageFlipAudio(true)}>
                    <FontAwesome name='toggle-off' size={30} color='#B3B8B3' />
                    </TouchableHighlight> }
                 {this.state.isPageFlipAudioActive && <TouchableHighlight onPress={()=>this.controlPageFlipAudio(false)}>
                    <FontAwesome name='toggle-on' size={30} color='#18B50E' />
                  </TouchableHighlight> }
                </View>
              </View>
            </View>
            <Text style={styles.modalText}>Dark Mode</Text>
            <View style={styles.settingHolderStyle}>
              <View style={styles.settingOptionStyle}>
                <View style={styles.readModeIconStyle}>
                {!this.state.isDarkBg && <TouchableHighlight onPress={()=>this.changeColor(true)}>
                    <FontAwesome name='toggle-off' size={30} color='#B3B8B3' />
                    </TouchableHighlight>}
                 {this.state.isDarkBg && <TouchableHighlight onPress={()=>this.changeColor(false)}>
                    <FontAwesome name='toggle-on' size={30} color='#18B50E' />
                  </TouchableHighlight>}
                </View>
              </View>
            </View>
            {/* <View style={styles.applyButton}> */}
            <TouchableHighlight
              style={{ ...styles.applyButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                this.savePrivateDisplayPreferences();
              }}
            >
              <Text style={styles.textStyle}>Apply</Text>
            </TouchableHighlight>
            {/* </View> */}
          </View>
        </View>
      </Modal>
    );
  }

  renderBottomActionBar = () => {
    return (
      <LinearGradient
      colors={!this.state.isDarkBg?['#F3527B', '#F9B3C5']:['#202120', '#454745']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bottomActionBarStyle}>

        <View style={styles.settingsButton}>
          <TouchableOpacity onPress={() => {
            this.setModalVisible(true);
          }}>
            <Fontisto name='player-settings' size={30} color='#99062C' />
          </TouchableOpacity>
        </View>

        <View style={styles.pageNumStyle}>
          <Text style={styles.pageNumTextStyle}>{this.state.currentPageDisplay} / {this.state.totalPages}</Text>
        </View>
        <View style={styles.pageNavigatorButton}>
          <TouchableOpacity onPress={() => this.gotToPreviousPage()}>
            <View style={styles.nextPageButtons}>
              <Ionicons name='ios-arrow-back' size={30} color='#99062C' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.goToNextPage()}>
            <View style={styles.nextPageButtons}>
              <Ionicons name='ios-arrow-forward' size={30} color='#99062C' />
            </View>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    );

  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      // <View style={styles.container}>
      <GestureRecognizer
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{...styles.container,backgroundColor : this.state.backGroundColor}}
        >
        <NavigationEvents onWillFocus={() => this.getPrivateDisplayPreferences()} />
        <Pdf
          ref={(pdf) => { this.pdf = pdf; }}
          fitPolicy={2}
          enablePaging={true}
          horizontal={this.state.isHorizontalFlipActive}
          source={this.source}
          onLoadComplete={(numberOfPages, filePath) => {
            //this.totalPages = numberOfPages;
            //console.warn(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            this.changeCurrentPageNumber(page, numberOfPages);
            //this.setState({currentPageDisplay:page})
            this.currentPage = page;
            //console.warn(`current page: ${page}`);
          }}
          onError={(error) => {
            console.warn(error);
          }}
          onPressLink={(uri) => {
            console.warn(`Link presse: ${uri}`)
          }}
          style={{...styles.pdf,backgroundColor : this.state.backGroundColor}} />
        {this.renderBottomActionBar()}
        {this.renderModal()}
        </GestureRecognizer>
      // </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    width: screenWidth - 20,
    height: Dimensions.get('window').height,

  },
  topActionBarStyle: {
    width: screenWidth,
    height: 40,
    flexDirection: 'row',
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  bottomActionBarStyle: {
    width: screenWidth,
    height: 50,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  pageNavigatorButton: {
    flex: 1,
    flexDirection: 'row',
  },
  nextPageButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 2,
    paddingLeft: 15,
    paddingRight: 15,
    marginHorizontal: 10,
  },
  settingsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  pageNumTextStyle: {
    color: '#99062C',
    fontSize: 15,
    fontWeight: 'bold',
  },

  //Modal styles======
  centeredView: {
    flex: 1,
    //flexDirection: 'column',

    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  modalView: {
    flexDirection: 'column',
    margin: 20,
    height: 2 * Dimensions.get('screen').height / 3,
    width: screenWidth - 40,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  headerStyle: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    backgroundColor: '#D1D8D8',
    marginBottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 2,
    borderBottomColor: 'black',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  readModeIconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    marginBottom: 8,
  },
  applyButton: {
    position: 'absolute',
    margin: 16,
    backgroundColor: "#F194FF",
    padding: 10,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
    right: 30,
    bottom: 10,
  },
  settingHolderStyle: {
    flexDirection: 'row',
    //marginLeft: 10,
    borderBottomColor: 'black',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingOptionStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 10
  }
});


export default Book