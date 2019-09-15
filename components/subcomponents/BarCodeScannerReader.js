import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import {
    Text,
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
            barCodeScanned: false,
            hasCameraPermission: false,
            flashMode: 'off',
        };
        this.toggleFlashMode = this.toggleFlashMode.bind(this);
        this.checkCameraPermissions = this.checkCameraPermissions.bind(this);
    }

    async componentDidMount() {
        await this.checkCameraPermissions();
    }

    handleBarCodeRead = (data) => {
        if (!this.state.barCodeScanned) {
            const barcodeUrl = JSON.stringify(data.data);
            this.setState({ barCodeScanned: true, flashMode: 'off' }, async () => {
                const locationUrl = /(\/locations\/)([A-Z0-9]{6})/.exec(barcodeUrl);
                if (locationUrl && locationUrl[1] && locationUrl[2]) {
                    try {
                        const url = `${locationUrl[1]}${locationUrl[2]}`;
                        const config = {
                            headers: {
                                Authorization: `Token ${this.props.appStore.authToken}`,
                            },
                        };
                        const response = await axios.get(url, config);
                        if (response.data && response.data.data && response.data.data.code) {
                            this.props.navigateNext(response.data.data);
                        } else {
                            this.setState({ barCodeScanned: false });
                        }
                    } catch (error) {
                        this.setState({ barCodeScanned: false });
                        axios.post('/log/', {
                            context: 'BarCodeScannerReader.js', error, message: error.message, stack: error.stack,
                        });
                    }
                } else {
                    this.setState({ barCodeScanned: false });
                }
            });
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

    render() {
        if (this.state.hasCameraPermission) {
            return (
                <View style={{ flex: 1 }}>
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
                </View>
            );
        }
        return <Text> No camera view. Please give GreenToGo permission to access your camera so we can read QR codes! </Text>;
    }
}

export default BarCodeScannerReader;
