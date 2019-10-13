import React from 'react';
import Constants from 'expo-constants';
import {
    WebView,
    Linking,
    Text,
    View,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import {
    Header,
    Form,
    Item,
    Input,
    Label,
    Spinner,
} from 'native-base';
import axios from '../apiClient';
import styles from '../styles';
import G2GTitleImage from './subcomponents/G2GTitleImage';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
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
            redirectToWeb: false,
        };
    }

    switchType = type => () => {
        this.setState({ type, error: [], msg: null });
    }

    attemptLogin = async () => {
        if (this.state.username && this.state.password) {
            this.setState({ error: [], loading: true });
            const body = {
                username: this.state.username,
                password: this.state.password,
            };
            try {
                const loginResponse = await axios.post('/auth/login/', body);
                const meResponse = await axios.get('/me/');
                this.setState({ loading: false });
                this.props.store.setUserData(meResponse.data.data);
                this.props.store.setAuthToken(loginResponse.data.auth_token);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.non_field_errors) {
                    this.setState({ loading: false, error: error.response.data.non_field_errors });
                } else if (error.response && error.response.data && (error.response.data.password || error.response.data.username)) {
                    this.setState({ loading: false, error: error.response.data });
                } else {
                    this.setState({ loading: false, error: ['We are sorry, we are having trouble processing your request. Please try again later.'] });
                    this.props.store.clearAuthToken();
                    axios.log('LoginScreen.js attemptLogin', error);
                }
            }
        } else {
            const tempErrors = {};
            if (!this.state.username) {
                tempErrors.username = 'Username cannot be empty.';
            }
            if (!this.state.password) {
                tempErrors.password = 'Password cannot be empty.';
            }
            this.setState({ loading: false, error: tempErrors });
        }
    }

    attemptSignUp = async () => {
        this.setState({ error: [], loading: true }, async () => {
            const body = {
                username: this.state.username,
                password1: this.state.password1,
                password2: this.state.password2,
                email: this.state.email,
                email2: this.state.email2,
            };
            try {
                const response = await axios.post('/register/', body);
                this.setState({
                    loading: false, type: 'signUpSuccess', username: null, msg: response.data.data,
                });
            } catch (error) {
                if (error.response.data.data) {
                    this.setState({ loading: false, error: error.response.data.data });
                } else {
                    this.setState({ loading: false, error: ['We are sorry, we are having trouble processing your request. Please try again later.'] });
                    axios.log('LoginScreen.js attemptSignUp', error);
                }
            }
        });
    }

    attemptPasswordReset = async () => {
        this.setState({ loading: true }, async () => {
            const body = {
                userString: this.state.username,
            };
            try {
                const response = await axios.post('/password/reset/', body);
                this.setState({
                    loading: false, type: 'passwordResetSuccess', username: null, msg: response.data.data,
                });
            } catch (error) {
                if (error.response.data && error.response.data.data && error.response.data.data.error) {
                    this.setState({ loading: false, error: [error.response.data.data.error] });
                } else {
                    this.setState({ loading: false, error: ['We are sorry, we are having trouble processing your request. Please try again later.'] });
                    axios.log('LoginScreen.js attemptPasswordReset', error);
                }
            }
        });
    }

    render() {
        const loadingSpinner = this.state.loading
            ? <Spinner color={styles.primaryCream} />
            : null;
        let errorMessages = null;
        if (this.state.error[0] !== undefined) {
            errorMessages = this.state.error.map(error => <Text key={`${error.trim()}`} style={styles.errorStyle}>{error}</Text>);
        }
        if (this.state.redirectToWeb) {
            const uri = this.state.redirectToWeb;
            return (
                <WebView
                    ref={(ref) => { this.webview = ref; }}
                    source={{ uri }}
                    onNavigationStateChange={(event) => {
                        this.setState({ redirectToWeb: false });
                        Linking.openURL(event.url);
                        this.webview.stopLoading();
                    }}
                />
            );
        }
        let footer = null;
        if (this.state.type === 'login') {
            footer = (
                <View style={styles.loginScreenButtonBar}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.switchType('signUp')}>
                        <Text style={styles.boldWhiteText}>Sign Up!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={this.attemptLogin}>
                        <Text style={styles.boldWhiteText}>Login</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.state.type === 'signUp') {
            footer = (
                <View style={styles.loginScreenButtonBar}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.switchType('login')}>
                        <Text style={styles.boldWhiteText}>Go to Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={this.attemptSignUp}>
                        <Text style={styles.boldWhiteText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.state.type === 'passwordReset') {
            footer = (
                <View style={styles.loginScreenButtonBar}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.switchType('login')}>
                        <Text style={styles.boldWhiteText}>Go to Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={this.attemptPasswordReset}>
                        <Text style={styles.boldWhiteText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (this.state.type === 'signUpSuccess') {
            footer = (
                <View style={styles.loginScreenButtonBar}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.switchType('login')}>
                        <Text style={styles.boldWhiteText}>Go to Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={() => { this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/subscriptions/new/' }); }}>
                        <Text style={styles.boldWhiteText}>Purchase a subscription</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            footer = (
                <View style={styles.loginScreenButtonBar}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.switchType('login')}>
                        <Text style={styles.boldWhiteText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <Header style={{ backgroundColor: styles.primaryColor, marginTop: Constants.statusBarHeight }}>
                    <G2GTitleImage />
                </Header>
                <ImageBackground
                    source={require('../assets/icons/loginscreen.jpg')}
                    resizeMode="cover"
                    style={styles.loginBackgroundImage}
                >
                    {this.state.type === 'login' && (
                        <Form style={styles.loginSignupMargin}>
                            <ScrollView>
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Username/Email</Label>
                                    <Input
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ username: text })}
                                        value={this.state.username}
                                    />
                                </Item>
                                {this.state.error.username ? <Text style={styles.errorStyle}>{this.state.error.username}</Text> : <Text />}
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Password</Label>
                                    <Input
                                        secureTextEntry
                                        onSubmitEditing={this.attemptLogin}
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ password: text })}
                                    />
                                </Item>
                                {errorMessages}
                                {loadingSpinner}
                                {this.state.error.password ? <Text style={styles.errorStyle}>{this.state.error.password}</Text> : <Text />}
                                <TouchableOpacity style={styles.loginButton} onPress={this.switchType('passwordReset')}>
                                    <Text style={{ ...styles.centeredText, color: 'white' }}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </Form>
                    )}
                    {this.state.type === 'signUp' && (
                        <Form style={styles.loginSignupMargin}>
                            <ScrollView>
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Username</Label>
                                    <Input
                                        autoCapitalize="none"
                                        secureTextEntry={false}
                                        autoCorrect={false}
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ username: text })}
                                    />
                                </Item>
                                {this.state.error.username ? <Text style={styles.errorStyle}>{this.state.error.username}</Text> : <Text />}
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Email</Label>
                                    <Input
                                        autoCapitalize="none"
                                        secureTextEntry={false}
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ email: text })}
                                    />
                                </Item>
                                {this.state.error.email ? <Text style={styles.errorStyle}>{this.state.error.email}</Text> : <Text />}
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Confirm Email</Label>
                                    <Input
                                        autoCapitalize="none"
                                        secureTextEntry={false}
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ email2: text })}
                                    />
                                </Item>
                                {this.state.error.email2 ? <Text style={styles.errorStyle}>{this.state.error.email2}</Text> : <Text />}
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Password</Label>
                                    <Input
                                        secureTextEntry
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ password1: text })}
                                    />
                                </Item>
                                {this.state.error.password1 ? <Text style={styles.errorStyle}>{this.state.error.password1}</Text> : <Text />}
                                <Item floatingLabel>
                                    <Label style={styles.loginLabelStyle}>Confirm Password</Label>
                                    <Input
                                        secureTextEntry
                                        onSubmitEditing={this.attemptSignUp}
                                        style={styles.loginInputStyle}
                                        onChangeText={text => this.setState({ password2: text })}
                                    />
                                </Item>
                                {this.state.error.password2 ? <Text style={styles.errorStyle}>{this.state.error.password2}</Text> : <Text />}
                                {errorMessages}
                                {loadingSpinner}
                                <Text style={styles.space} />
                            </ScrollView>
                        </Form>
                    )}
                    {this.state.type === 'passwordReset' && (
                        <Form style={styles.loginSignupMargin}>
                            <Item floatingLabel>
                                <Label style={styles.loginLabelStyle}>Username/Email</Label>
                                <Input
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    style={styles.loginInputStyle}
                                    onChangeText={text => this.setState({ username: text })}
                                    onSubmitEditing={this.attemptPasswordReset}
                                    value={this.state.username}
                                />
                            </Item>
                            {errorMessages}
                            {loadingSpinner}
                        </Form>
                    )}
                    {this.state.msg && <Text style={styles.boldWhiteText}>{this.state.msg}</Text>}
                    <View style={styles.bottomFixed}>
                        {footer}
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        );
    }
}

export default LoginScreen;
