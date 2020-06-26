import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';


class Declaration extends React.Component {


    render() {
        return (
            
            <View style={styles.container}>
                <ScrollView
                showsVerticalScrollIndicator ={false}>
                <View style={styles.titleContainer}>
                    <Entypo name='megaphone' size={25} color="#99062C" />
                    <Text style={styles.titleStyle}>Declaration & Disclaimer</Text>
                </View>
                <View style = {styles.paraContainer}>
                    <Text style={styles.paraTextStyle}>
                        Most of the articles published in this application are fetched from free internet sources, however we have publised some article 
                        with consent from article owners. If you find any article that belongs to you and you have any objection in publishing them in this 
                        application, please contact us via feeback, we will review it and do the needful. Thank you.   
                    </Text>
                </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    titleStyle : {
        fontSize : 18,
        color : '#99062C',
        letterSpacing :0.5,
        fontWeight:'bold',
        marginLeft : 20,
    },
    paraTextStyle : {
        fontSize : 15,
        color : '#333',
        textAlign : 'justify',
    },
    bulletinTextStyle : {
        fontSize : 15,
        color : '#333',
        textAlign : 'justify',
        padding: 5,
    },
    titleContainer : {
        flexDirection : 'row',
        paddingLeft:5,
        paddingRight:5,
        paddingTop:10
    },
    paraContainer : {
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10
    }
});

export default Declaration;