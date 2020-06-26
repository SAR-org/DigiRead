import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    PermissionsAndroid,
    Alert,
    Platform,

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import RNFetchBlob from 'rn-fetch-blob'
import CustomModal from './CustomModal';

class BookViewHeader extends React.Component {

    state = {
        isThisBookFavorite: false,
        favoriteBookArray: null,
        downloadUri: '',
        modalVisible: false,
        modalHeaderValue: '',
        modalTextValue: '',
    }
    componentDidMount() {
        this.setState({
            favoriteBookArray: this.props.favouriteBookArr,
            isThisBookFavorite: this.props.isThisBookFav, downloadUri: this.props.downloadUri
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.isThisBookFavorite !== this.props.isThisBookFav) {
            this.setState({ isThisBookFavorite: this.props.isThisBookFav });
        }
        if (prevState.favoriteBookArray !== this.props.favouriteBookArr) {
            this.setState({ favoriteBookArray: this.props.favouriteBookArr })
        }
    }

    handleFavouriteAction = async () => {
        var bookId = this.props.thisBookId.toString();

        var favBookArr = this.state.favoriteBookArray;

        if (this.isThisBookAlreadyFavourite(favBookArr, bookId)) {
            this.setState({ isThisBookFavorite: false });
            const index = favBookArr.indexOf(bookId);
            favBookArr.splice(index, 1);
            this.setState({ favoriteBookArray: favBookArr })

        } else {
            this.setState({ isThisBookFavorite: true });

            favBookArr.push(bookId);
            this.setState({ favoriteBookArray: favBookArr });

            this.increaseOverallFavoriteCount(bookId);

        }

        this.handlePrivateConfigsFav(this.state.favoriteBookArray);

    }

    increaseOverallFavoriteCount = (bookId) => {
        var api = 'https://mobilerading.000webhostapp.com/digiread/api/book/increasefavouritecount.php?id=' + bookId;
        try {
            axios.get(api)
        } catch (e) {
            console.error(e);
        }

    }

    releaseModal() {
        const wait = () => new Promise((resolve) => setTimeout(resolve, 2000));
        //this.setState({modalVisible:false});
        wait(1000).then(() => this.setState({modalVisible : false}))
    }

    openModal =(headerText,messageText)=>{
        this.setState({modalVisible : true,
            modalHeaderValue : headerText,
            modalTextValue : messageText});
    }

    changeModalMessage  = (headerText,messageText)=>{
        this.setState({modalHeaderValue : headerText,
            modalTextValue : messageText});
    }

    downloadBook = async () => {

        try {
            if (Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.openModal("Downloading","The book download is in-progress....")
                    //Alert.alert("Downloading......")
                    const bookUri = this.props.downloadUri;
                    // let fileName = bookUri.substring(bookUri.lastIndexOf('/') + 1, bookUri.length)
                    let fileName = this.props.headerText;
                    const { config, fs } = RNFetchBlob
                    let DownloadDir = fs.dirs.DownloadDir
                    let options = {
                        fileCache: true,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path: DownloadDir + "/D-Read/" + fileName + ".pdf",
                            description: 'Downloading image.'
                        }
                    }
                    config(options).fetch('GET', bookUri).

                        then((res) => {
                            this.changeModalMessage("Success","Download is completed!");
                            //Alert.alert("Download is completed!")
                            this.releaseModal();
                        })
                    this.increaseDownloadCount(this.props.thisBookId.toString());

                } else {
                    Alert.alert("Please allow permission", "Please allow permission to save file in your storage", [
                        {
                            text: "Noted",
                            onPress: () => null,
                            style: "cancel"
                        }
                    ]);
                }
            } else {
                this.openModal("Downloading","The book download is in-progress....,Please save the file when pops up")
                const bookUri = this.props.downloadUri;
                //let fileName = bookUri.substring(bookUri.lastIndexOf('/') + 1, bookUri.length)
                let fileName = this.props.headerText;
                const { config, fs } = RNFetchBlob
                let DownloadDir = RNFetchBlob.fs.dirs.DocumentDir
                let options = {
                    fileCache: true,
                    path: DownloadDir + "/DigiRead/" + fileName + ".pdf",
                    description: 'Downloading image.'
                }
		//this.changeModalMessage("Success","Download is completed!,Please save the file");
		this.releaseModal();
                config(options).fetch('GET', bookUri).then((resp) => {
                    //this.changeModalMessage("Success","Download is completed!,Please save the file");
                            //Alert.alert("Download is completed!")
                    //this.releaseModal();
                    RNFetchBlob.ios.openDocument(resp.data);
                })
		this.increaseDownloadCount(this.props.thisBookId.toString());
            }

        } catch (err) {
            this.changeModalMessage("Error!","Download Failed");
                            //Alert.alert("Download is completed!")
            this.releaseModal();
            //console.warn(err);
        }

    }

    increaseDownloadCount = (bookId) => {
        var api = 'https://mobilerading.000webhostapp.com/digiread/api/book/increasedownloadcount.php?id=' + bookId;
        try {
            axios.get(api)
        } catch (e) {
            console.error(e);
        }

    }

    handlePrivateConfigsFav = async (newFavorite) => {

        AsyncStorage.getItem('myAppConfigsTest').then((value) => {
            if (value != null) {
                var configJson = JSON.parse(value);
                configJson.favorite = newFavorite;
                AsyncStorage.setItem("myAppConfigsTest", JSON.stringify(configJson));
            } else {
                var configJson = this.getConfigJson();
                configJson.favorite = newFavorite;
                AsyncStorage.setItem("myAppConfigsTest", JSON.stringify(configJson));
            }

        });
    }

    getConfigJson = () => {
        return {
            favorite: [],
            isBookDisplayDark: false,
            isFlipReadMode: true,
            isPageFlipeAudoActive: true
        }
    }

    isThisBookAlreadyFavourite = (favBookArr, bookId) => {
        if (favBookArr.indexOf(bookId) > -1) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <View style={styles.header}>
                {/* <View style={styles.headerTitle}>
                    <Text
                        style={styles.headerText}>
                        {this.props.headerText}
                    </Text>
                </View> */}
                <TouchableOpacity
                    style={styles.favoriteStyle}
                    onPress={() => this.handleFavouriteAction()}>
                    {!this.state.isThisBookFavorite && <MaterialIcons
                        name="favorite-border"
                        size={24}
                        color="#99062C"
                    />}
                    {this.state.isThisBookFavorite && <MaterialIcons
                        name="favorite"
                        size={24}
                        color="red" />}

                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadStyle}
                    //onPress={() => this.handleDownloadAction()}>
                    onPress={() => this.downloadBook()}>
                    <Entypo name="download" size={24} color="#99062C" />
                </TouchableOpacity>
                <CustomModal 
                    modalVisible = {this.state.modalVisible} 
                    modalHeaderValue = {this.state.modalHeaderValue}
                    modalTextValue = {this.state.modalTextValue}/>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        //justifyContent : 'center',
        //backgroundColor : '#9DD3E4',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white',
        letterSpacing: 1,
    },
    icon: {
        position: 'absolute',
        left: 0,
    },
    headerImage: {
        width: 50,
        height: 50,
        marginHorizontal: 20,
    },
    headerTitle: {
        position: 'absolute',
        left: 0,
        flexDirection: 'row',
    },
    favoriteStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 7
    },
    downloadStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    }
});

export default BookViewHeader;
