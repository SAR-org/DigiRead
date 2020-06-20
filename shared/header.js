import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions,
} from 'react-native';
import  MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


class Header extends React.Component{

    openMenu = ()=>{
        this.props.navigation.openDrawer();
    }
    render(){
        return (
           <View style={styles.header}>
               <MaterialCommunityIcons 
               name="xbox-controller-menu" 
               size={40} color="white" 
               onPress={this.openMenu} 
               style={styles.icon}/>
               <View style={styles.headerTitle}>
                    
                            <Text 
                            style={styles.headerText}>{this.props.headerText}</Text>
               </View>
           </View> 
        );
        
    }
        
    
}

const styles = StyleSheet.create({
    header : {
	//flex : 1,
        width : Platform.OS=='ios'?Dimensions.get('screen').width : '100%',
        //width : '100%',
        height : '100%',
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
    },
    headerText : {
        fontSize : 25,
        color : 'white',
        fontFamily: 'CinzelDecorative-Black',
    },
    icon : {
        position : 'absolute',
//	justifyContent :'flex-start',
        left : Platform.OS=='ios'?20:0,
    },
    headerTitle : {
        flexDirection : 'row',
    }
});

export default Header;
