import React from "react";
import { Constants } from 'expo';
import axios from '../apiClient';
import { WebView, Linking } from 'react-native';
import {
    Text,
    View,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView,
} from "react-native";
import {
    Header,
    Form,
    Item,
    Input,
    Button,
    Spinner,
} from "native-base";
import styles from "../styles";
import G2GTitleImage from "./subcomponents/G2GTitleImage";

class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: null,
            email: null,
            email2: null,
            password: null,
            password1: null,
            password2: null,
            error: [],
            msg: null,
            loading: false,
            type: 'login',
            redirectToWeb: false
        }
        this.attemptLogin = this.attemptLogin.bind(this);
        this.attemptSignUp = this.attemptSignUp.bind(this);
        this.attemptPasswordReset = this.attemptPasswordReset.bind(this);
    }

    attemptLogin() {
        if (this.state.username && this.state.password) {
            this.setState({ error: [], loading: true });
            let body = {
                username: this.state.username,
                password: this.state.password
            };
            axios.post('/auth/login/', body).then((loginResponse) => {
                // Get the user data after successful login
                axios.get('/me/', {
                    headers: {
                        'Authorization': `Token ${loginResponse.data.auth_token}`
                    }
                }).then((meResponse) => {
                    this.setState({ loading: false });
                    this.props.store.setUserData(meResponse.data.data);
                    this.props.store.setAuthToken(loginResponse.data.auth_token);
                }).catch((error) => {
                    axios.post('/log/', { 'context': 'LoginScreen.js me', 'error': error, 'message': error.message, 'stack': error.stack });
                    this.setState({ error: ["We are sorry, we are having trouble processing your request. Please try again later."], loading: false });
                    this.props.store.clearAuthToken();
                })
            }).catch((error) => {
                // TODO
                // HANDLE THESE LOCALLY
                if (error.response && error.response.data && error.response.data.non_field_errors) {
                    this.setState({ error: error.response.data.non_field_errors, loading: false });
                } else if (error.response.data.password || error.response.data.username) {
                    let tempErrors = {};
                    if (error.response.data.username && error.response.data.username[0] === "This field may not be null.") {
                        tempErrors.username = "Username cannot be empty.";
                    }
                    if (error.response.data.password && error.response.data.password[0] === "This field may not be null.") {
                        tempErrors.password = "Password cannot be empty.";
                    }
                    this.setState({ error: tempErrors, loading: false });
                } else {
                    axios.post('/log/', { 'context': 'LoginScreen.js auth login', 'error': error, 'message': error.message, 'stack': error.stack });
                    this.setState({ error: ["We are sorry, we are having trouble processing your request. Please try again later."], loading: false });
                }
            });
        } else {
            let tempErrors = {};
            if (!this.state.username) {
                tempErrors.username = "Username cannot be empty.";
            }
            if (!this.state.password) {
                tempErrors.password = "Password cannot be empty.";
            }
            this.setState({ error: tempErrors, loading: false });
        }
    }

    attemptSignUp() {
        this.setState({ error: [], loading: true }, () => {
            let body = {
                username: this.state.username,
                password1: this.state.password1,
                password2: this.state.password2,
                email: this.state.email,
                email2: this.state.email2,
            }
            axios.post('/register/', body).then((response) => {
                this.setState({ loading: false, type: 'signUpSuccess', username: null, msg: response.data.data });
            }).catch((error) => {
                if (error.response.data.data) {
                    this.setState({ error: error.response.data.data, loading: false });
                } else {
                    axios.post('/log/', { 'context': 'LoginScreen.js attemptSignUp', 'error': error, 'message': error.message, 'stack': error.stack });
                    this.setState({ error: ["We are sorry, we are having trouble processing your request. Please try again later."], loading: false });
                }
            });
        });
    }

    attemptPasswordReset() {
        this.setState({ loading: true }, () => {
            let body = {
                userString: this.state.username
            };
            axios.post('/password/reset/', body).then((response) => {
                this.setState({ loading: false, type: 'passwordResetSuccess', username: null, msg: response.data.data });
            }).catch((error) => {
                if (error.response.data && error.response.data.data && error.response.data.data.error) {
                    this.setState({ loading: false, error: [error.response.data.data.error] });
                } else {
                    axios.post('/log/', { 'context': 'LoginScreen.js password reset', 'error': error, 'message': error.message, 'stack': error.stack });
                    this.setState({ loading: false, error: ["We are sorry, we are having trouble processing your request. Please try again later."] });
                }
            });
        })
    }

    switchType = (type) => () => {
        this.setState({ type, error: [] });
    }

    render() {
        let loadingSpinner = this.state.loading ?
            <Spinner color={styles.primaryCream} />
            : null;
        let errorMessages = null;
        if (this.state.error[0] !== undefined) {
            errorMessages = this.state.error.map((error, index) => {
                return <Text key={index} style={styles.errorStyle}>{error}</Text>;
            });
        }
        if (this.state.redirectToWeb) {
            let uri = this.state.redirectToWeb;
            return (
                <WebView
                    ref={(ref) => { this.webview = ref; }}
                    source={{ uri }}
                    onNavigationStateChange={(event) => {
                        this.setState({ redirectToWeb: false })
                        Linking.openURL(event.url);
                        this.webview.stopLoading();
                    }}
                />
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                    <Header style={{ backgroundColor: styles.primaryColor, marginTop: Constants.statusBarHeight }}>
                        <G2GTitleImage />
                    </Header>
                    <ImageBackground
                        source={require('../assets/icons/loginscreen.jpg')}
                        resizeMode='cover'
                        style={styles.loginBackgroundImage}>
                        {this.state.type === 'login' ?
                            // Login form
                            <Form>
                                <ScrollView>
                                    <Item>
                                        <Input placeholder="Username or Email"
                                            placeholderTextColor='white'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType="email-address"
                                            style={styles.loginInputStyle}
                                            onChangeText={(text) => this.setState({ username: text })}
                                            value={this.state.username}
                                        />
                                    </Item>
                                    {this.state.error.username ? <Text style={styles.errorStyle}>{this.state.error.username}</Text> : <Text></Text>}
                                    <Item last>
                                        <Input placeholder="Password"
                                            placeholderTextColor='white'
                                            secureTextEntry={true}
                                            onSubmitEditing={this.attemptLogin}
                                            style={styles.loginInputStyle}
                                            onChangeText={(text) => this.setState({ password: text })}
                                        />
                                    </Item>
                                    {errorMessages}
                                    {loadingSpinner}
                                    {this.state.error.password ? <Text style={styles.errorStyle}>{this.state.error.password}</Text> : <Text></Text>}
                                    <Button style={styles.transparentBackground} full title="passwordReset" onPress={this.switchType("passwordReset")}>
                                        <Text style={styles.boldWhiteText}>Forgot Password?</Text>
                                    </Button>
                                </ScrollView>
                            </Form>
                            : this.state.type === 'signUp' ?
                                // Sign up form below
                                <Form>
                                    <ScrollView>
                                        <Item>
                                            <Input placeholder="Username"
                                                placeholderTextColor='white'
                                                autoCapitalize="none"
                                                secureTextEntry={false}
                                                autoCorrect={false}
                                                style={styles.loginInputStyle}
                                                onChangeText={(text) => this.setState({ username: text })}
                                            />
                                        </Item>
                                        {this.state.error.username ? <Text style={styles.errorStyle}>{this.state.error.username}</Text> : <Text></Text>}
                                        <Item>
                                            <Input placeholder="Email"
                                                placeholderTextColor='white'
                                                autoCapitalize="none"
                                                secureTextEntry={false}
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                style={styles.loginInputStyle}
                                                onChangeText={(text) => this.setState({ email: text })}
                                            />
                                        </Item>
                                        {this.state.error.email ? <Text style={styles.errorStyle}>{this.state.error.email}</Text> : <Text></Text>}
                                        <Item>
                                            <Input placeholder="Confirm Email"
                                                placeholderTextColor='white'
                                                autoCapitalize="none"
                                                secureTextEntry={false}
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                style={styles.loginInputStyle}
                                                onChangeText={(text) => this.setState({ email2: text })}
                                            />
                                        </Item>
                                        {this.state.error.email2 ? <Text style={styles.errorStyle}>{this.state.error.email2}</Text> : <Text></Text>}
                                        <Item>
                                            <Input placeholder="Password"
                                                placeholderTextColor='white'
                                                secureTextEntry={true}
                                                style={styles.loginInputStyle}
                                                onChangeText={(text) => this.setState({ password1: text })}
                                            />
                                        </Item>
                                        {this.state.error.password1 ? <Text style={styles.errorStyle}>{this.state.error.password1}</Text> : <Text></Text>}
                                        <Item last>
                                            <Input placeholder="Confirm Password"
                                                placeholderTextColor='white'
                                                secureTextEntry={true}
                                                onSubmitEditing={this.attemptSignUp}
                                                style={styles.loginInputStyle}
                                                onChangeText={(text) => this.setState({ password2: text })}
                                            />
                                        </Item>
                                        {this.state.error.password2 ? <Text style={styles.errorStyle}>{this.state.error.password2}</Text> : <Text></Text>}
                                        {errorMessages}
                                        {loadingSpinner}
                                    </ScrollView>
                                </Form>
                                : this.state.type === 'passwordReset' ?
                                    <Form>
                                        <Item>
                                            <Input placeholder="Username or Email"
                                                placeholderTextColor='white'
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                style={styles.loginInputStyle}
                                                onChangeText={(text) => this.setState({ username: text })}
                                                onSubmitEditing={this.attemptPasswordReset}
                                                value={this.state.username}
                                            />
                                        </Item>
                                        {errorMessages}
                                        {loadingSpinner}
                                    </Form>
                                    : <Text style={styles.boldWhiteText}>{this.state.msg}</Text>
                        }
                        <View style={styles.bottomFixed}>
                            {this.state.type === 'login' ?
                                <View style={styles.loginScreenButtonBar}>
                                    <Button style={styles.transparentBackground} full title="SignUp" onPress={this.switchType("signUp")}>
                                        <Text style={styles.boldWhiteText}>Sign Up!</Text>
                                    </Button>
                                    <Button style={styles.transparentBackground} full title="Login" onPress={this.attemptLogin}>
                                        <Text style={styles.boldWhiteText}>Login</Text>
                                    </Button>
                                </View>
                                : this.state.type === 'signUp' ?
                                    <View style={styles.loginScreenButtonBar}>
                                        <Button style={styles.transparentBackground} full title="SignUp" onPress={this.switchType("login")}>
                                            <Text style={styles.boldWhiteText}>Go to Login</Text>
                                        </Button>
                                        <Button style={styles.transparentBackground} full title="Login" onPress={this.attemptSignUp}>
                                            <Text style={styles.boldWhiteText}>Sign Up</Text>
                                        </Button>
                                    </View>
                                    : this.state.type === 'passwordReset' ?
                                        <View style={styles.loginScreenButtonBar}>
                                            <Button style={styles.transparentBackground} light full title="SignUp" onPress={this.switchType("login")}>
                                                <Text style={styles.boldWhiteText}>Go to Login</Text>
                                            </Button>
                                            <Button style={styles.transparentBackground} light full title="resetPassword" onPress={this.attemptPasswordReset}>
                                                <Text style={styles.boldWhiteText}>Reset Password</Text>
                                            </Button>
                                        </View>
                                        : this.state.type === 'signUpSuccess' ?
                                            <View style={styles.loginScreenButtonBar}>
                                                <Button style={styles.transparentBackground} full title="SignUp" onPress={this.switchType("login")}>
                                                    <Text style={styles.boldWhiteText}>Go to Login</Text>
                                                </Button>
                                                <Button style={styles.transparentBackground} full onPress={() => { this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/subscriptions/new/' }) }}>
                                                    <Text style={styles.boldWhiteText}>Purchase a subscription</Text>
                                                </Button>
                                            </View>
                                            :
                                            <View style={styles.loginScreenButtonBar}>
                                                <Button style={styles.transparentBackground} full title="SignUp" onPress={this.switchType("login")}>
                                                    <Text style={styles.boldWhiteText}>Go to Login</Text>
                                                </Button>
                                            </View>
                            }
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>
            )
        }
    }
}

export default LoginScreen;
