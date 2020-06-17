import React from 'react';
import {View,StyleSheet} from 'react-native';

class Card extends React.PureComponent {

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
export default Card;

const styles = StyleSheet.create({
    card : {
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
        justifyContent : 'center',
        alignItems : 'center'
    }
});