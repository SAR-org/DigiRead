import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Textarea from 'react-native-textarea';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';


class ReviewAndHelp extends React.Component {

    sendFeedback = (values, { resetForm }) => {
        var feedbackJson = {
            "name": "",
            "senderEmail": "",
            "feedback": ""
        }
        feedbackJson.name = values.name;
        feedbackJson.senderEmail = values.email;
        feedbackJson.feedback = values.feedback;
        const payload = JSON.stringify(feedbackJson);

        axios.post(
            'https://digi-read-email.herokuapp.com/feedback',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(res => {

            if (res.data == "Success") {
                resetForm({});
                Alert.alert("Thank you!", "Your feedback is recorded", [
                    {
                        text: "Ok",
                        onPress: () => null,
                        style: "cancel"
                    }]);
                return
            }
            if (res.data == "Failed") {
                Alert.alert("Oops!", "Looks like your email id is incorrect, may be a typo." +
                    "Please correct it and resend it. Thank you!", [
                    {
                        text: "Ok",
                        onPress: () => null,
                        style: "cancel"
                    }]);
            }

        }).catch(err => {
            Alert.alert("Apologies!", "Our servers are experiencing high traffic." +
                "Please try again later. Thank you.", [
                {
                    text: "Ok",
                    onPress: () => null,
                    style: "cancel"
                }]);
        });




    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView>
                    <View style={styles.container}>
                        <Formik
                            initialValues={{ name: '', email: '', feedback: '' }}
                            onSubmit={(values, { resetForm }) => this.sendFeedback(values, { resetForm })}
                            validationSchema={yup.object().shape({
                                name: yup.string().matches(/^[a-zA-Z]+$/, 'Name can only have alphabets.')
                                    .max(40, 'Name must be at most 40 characters.')
                                    .required("Your name is required."),
                                email: yup.string()
                                    .max(50, 'Email must be at most 50 characters.')
                                    .email("Invalid Email ID.")
                                    .required("Email ID is required."),
                                feedback: yup.string()
                                    .max(500, 'Maximum 500 characters are allowed in feedback content.')
                                    .required("Feedback is required.")
                            })}>
                            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                                <React.Fragment>
                                    <View style={styles.feedbackForm}>
                                        <Text style={styles.header}>Feedback</Text>
                                        <TextInput style={styles.textInput}
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                            onBlur={() => setFieldTouched('name')}
                                            placeholder="Your name"
                                            underlineColorAndroid={'transparent'}
                                        />
                                        {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
                                        <TextInput style={styles.textInput}
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            onBlur={() => setFieldTouched('email')}
                                            autoCapitalize='none'
                                            placeholder="Your Email ID"
                                            underlineColorAndroid={'transparent'} />
                                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                                        <Textarea
                                            containerStyle={styles.textareaContainer}
                                            value={values.feedback}
                                            onChangeText={handleChange('feedback')}
                                            onBlur={() => setFieldTouched('feedback')}
                                            style={styles.textAreaInput}
                                            placeholder="Feedback"
                                            maxLength={500}
                                            underlineColorAndroid={'transparent'} />
                                        {touched.feedback && errors.feedback && <Text style={styles.error}>{errors.feedback}</Text>}
                                        <TouchableOpacity style={styles.button}
                                            disabled={!isValid}
                                            onPress={handleSubmit}>
                                            <Text style={styles.btnText}>Send</Text>
                                        </TouchableOpacity>
                                    </View>
                                </React.Fragment>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedbackForm: {
        alignSelf: 'stretch',
    },
    header: {
        fontSize: 24,
        color: '#99062C',
        fontWeight: 'bold',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: '#99062C',
        borderBottomWidth: 1,

    },
    textInput: {
        alignSelf: 'stretch',
        fontSize: 16,
        height: 40,
        marginTop: 30,
        color: '#99062C',
        borderColor: '#99062C',
        borderBottomWidth: StyleSheet.hairlineWidth,

    },
    textareaContainer: {
        height: 180,
        //padding: 5,
    },
    textAreaInput: {
        height: 170,
        alignSelf: 'stretch',
        marginBottom: 30,
        color: '#99062C',
        borderColor: '#99062C',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    button: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#99062C',
        marginTop: 30,
        borderRadius: 20,
    },
    btnText: {
        fontSize: 20,
        color: 'white',
    },
    error: {
        fontSize: 13,
        color: 'red'

    }
});

export default ReviewAndHelp;