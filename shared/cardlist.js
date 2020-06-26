import React from 'react';
import {View,StyleSheet} from 'react-native';

class CardList extends React.PureComponent {

    render(){
        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    {this.props.children}
                </View>
            </View>
        );
    }
    
}
export default CardList;

const styles = StyleSheet.create({
    card : {
        //flexDirection : "row",
        borderRadius : 6,
        elevation : 3,
        backgroundColor : '#fff',
        shadowOffset : {width : 1, height : 1},
        shadowColor : '#333',
        shadowOpacity : 0.3,
        shadowRadius : 3,
        marginHorizontal : 4,
        marginVertical : 10,

    },
    cardContent : {
        justifyContent : 'flex-start',
        alignItems : 'flex-start'
    }
});