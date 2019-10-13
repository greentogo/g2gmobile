import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import {
    Text,
    Container,
    Content,
    Spinner,
} from 'native-base';
import axios from '../../apiClient';
import styles from '../../styles';

@inject('appStore')
@observer
class BarCodeScannerReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraMode: true,
            error: undefined,
            codeInput: '',
            barCodeScanned: false,
            hasCameraPermission: false,
            flashMode: 'off',
        };
        this.toggleFlashMode = this.toggleFlashMode.bind(this);
        this.toggleCameraMode = this.toggleCameraMode.bind(this);
        this.checkCameraPermissions = this.checkCameraPermissions.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
        this.handleBarCodeRead = this.handleBarCodeRead.bind(this);
    }

    async componentDidMount() {
        await this.checkCameraPermissions();
    }

    handleBarCodeRead(data) {
        if (!this.state.barCodeScanned) {
            const barcodeUrl = JSON.stringify(data.data);
            this.setState({ barCodeScanned: true, flashMode: 'off', error: undefined }, async () => {
                const locationUrl = /(\/locations\/)([A-Z0-9]{6})/.exec(barcodeUrl);
                if (locationUrl && locationUrl[1] && locationUrl[2]) {
                    this.checkCode(locationUrl[2]);
                } else {
                    this.setState({ barCodeScanned: false, error: 'Invalid Code' });
                }
            });
        }
    }

    handleCodeSubmit() {
        if (this.state.codeInput && this.state.codeInput.length > 0) {
            this.setState({ barCodeScanned: true, flashMode: 'off', error: undefined }, async () => {
                this.checkCode(this.state.codeInput);
            });
        }
    }

    async checkCode(code) {
        try {
            const url = `/locations/${code}`;
            const response = await axios.get(url);
            if (response.data && response.data.data && response.data.data.code) {
                this.props.navigateNext(response.data.data);
            } else {
                this.setState({ barCodeScanned: false, error: 'Invalid Code' });
            }
        } catch (error) {
            if (error.response.status !== 404) {
                this.setState({ barCodeScanned: false, error: 'Error reading code' });
                axios.log('BarCodeScannerReader.js', error);
            } else {
                this.setState({ barCodeScanned: false, error: 'Invalid Code' });
            }
        }
    }

    async checkCameraPermissions() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        return this.setState({ hasCameraPermission: status === 'granted' });
    }

    toggleFlashMode() {
        if (this.state.flashMode === 'off') {
            return this.setState({ flashMode: Camera.Constants.FlashMode.torch });
        }
        return this.setState({ flashMode: 'off' });
    }

    async toggleCameraMode() {
        await this.checkCameraPermissions();
        this.setState((prevState) => ({ cameraMode: !prevState.cameraMode }));
    }

    render() {
        if (this.state.hasCameraPermission && this.state.cameraMode) {
            return (
                <Container style={{ flex: 1 }}>
                    <Camera
                        onBarCodeScanned={this.handleBarCodeRead}
                        flashMode={this.state.flashMode}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={this.state.barCodeScanned ? styles.overlayDark : styles.overlay}>
                        {this.state.barCodeScanned ? (<Spinner color="blue" />) : (<Ionicons style={styles.qrCodeScanner} size={280} name="ios-qr-scanner" />)}
                    </View>
                    <View style={styles.loginScreenButtonBar}>
                        <TouchableOpacity style={styles.loginButton} onPress={this.toggleCameraMode}>
                            <Text style={styles.boldWhiteText}>Enter Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton} onPress={this.toggleFlashMode}>
                            {/* <Ionicons style={{ color: styles.primaryColor }} size={50} name="md-flashlight" /> */}
                            <Text style={styles.boldWhiteText}>Toggle Flash</Text>
                        </TouchableOpacity>
                    </View>
                </Container>
            );
        }
        return (
            <Container style={{ flex: 1 }}>
                <Content contentContainerStyle={styles.overlay}>
                    <Text style={styles.errorStyle}>{this.state.error}</Text>
                    <TextInput
                        style={styles.barCodeInput}
                        placeholder="Enter code"
                        autoCapitalize="characters"
                        onChangeText={(text) => this.setState({ codeInput: text.toUpperCase() })}
                        value={this.state.codeInput}
                    />
                    {this.state.barCodeScanned && (<Spinner color="blue" />)}
                    <TouchableOpacity
                        style={this.state.codeInput && this.state.codeInput.length > 0 ? styles.submissionSubmitButton : styles.submissionSubmitButtonBlocked}
                        onPress={this.state.codeInput && this.state.codeInput.length > 0 ? this.handleCodeSubmit : null}
                    >
                        <Text style={styles.submissionSubmitTextStyle}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                    {!this.state.hasCameraPermission && (<Text>No camera view. Please give GreenToGo permission to access your camera so we can read QR codes!</Text>)}
                </Content>
                <View style={styles.loginScreenButtonBar}>
                    <TouchableOpacity style={styles.loginButton} onPress={this.toggleCameraMode}>
                        <Text style={styles.boldWhiteText}>Use Camera</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }
}

export default BarCodeScannerReader;
