import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


class About extends React.Component {


    render() {
        return (
            
            <View style={styles.container}>
                <ScrollView
                showsVerticalScrollIndicator ={false}>
                <View style={styles.titleContainer}>
                    <AntDesign name="pushpin" size={18} color="#99062C" />
                    <Text style={styles.titleStyle}>What is D-Read?</Text>
                </View>
                <View style = {styles.paraContainer}>
                    <Text style={styles.paraTextStyle}>
                        D-Read, shortened form of DigiRead. Have you ever tried any other high-end book/e-book reading applications or devices?
                        D-Read is a mobile application for book readers who wish to carry a book along all the time, this is a free application to 
                        read e-books without downloading them to your device.
                        This application contains more than 2500 story books,magazies,biographies, novels, etc, and 
                        we are committed to upload new collections everyday. We assure that we have got collections in 
                        different geners for every age group.
                    </Text>
                </View>

                <View style={styles.titleContainer}>
                    <AntDesign name="pushpin" size={18} color="#99062C" />
                    <Text style={styles.titleStyle}>What's special in D-Read?</Text>
                </View>
                <View style = {styles.paraContainer}>
                    <Text style={styles.paraTextStyle}>
                        This application have got a rich user interface 
                        which is easy to use with many customisable options. Current features are,
                    </Text>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <AntDesign name="sound" size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>When you read/flip a page you will get feeling 
                            that you are actually flipping a real book's page.</Text>
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <AntDesign name="eyeo" size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>You can customise the reading pannel to dark 
                            mode so that it would be soothing for eyes during night reading.</Text>
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <MaterialCommunityIcons name="book-open-page-variant" 
                            size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>You can flips the book side by side or 
                            scroll it.</Text>
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <AntDesign name="heart" size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>You can add a book to your "Wish List" 
                            and visit later through "Wish List" panel.</Text>
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <AntDesign name="download" size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>This App will help you to read books 
                            without downloading to your local storage, however, 
                        we have provided an option to download books,if you wish.</Text>
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <MaterialCommunityIcons name="gesture-swipe" size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>You can almost access all the collections 
                            by right,left,top and down swiping.</Text>
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center'}}>
                            <Ionicons name="ios-search" size={18} color="#99062C" />
                            <Text style={styles.bulletinTextStyle}>Yould could do search and find a book easily, 
                        you can input book name/author name/language or even any 
                        random popular context related to a particular book. 
                        Our system is smart enough to understand you and find the article for you.</Text>
                        </View>
                        <Text style={styles.paraTextStyle}>
                            All the above features are currently available to alleviate reading experience, and many more 
                            features are aligned to be released in near future.
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

export default About;