import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
} from 'react-native';

export default class CustomModal extends React.Component {
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style = {styles.headerStyle}>
                        <Text style={styles.headerTextStyle}>
                            {this.props.modalHeaderValue}</Text>
                        </View>
                        
                        <View style={styles.modalText}>
                            <Text>{this.props.modalTextValue}</Text>
                        </View>
                    </View>
                </View>

            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
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
        backgroundColor: '#F3527B',
        marginBottom: 10,
      },
      headerTextStyle: {
        fontSize: 20,
        color: "#333",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        fontSize: 15,
        color: "#333",
        fontWeight: "bold",
        textAlign: "center",
        margin : 10,
      },
})