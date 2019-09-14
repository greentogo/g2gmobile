import React from 'react';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import {
    Text,
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
        };
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    handleBarCodeRead = (data) => {
        if (!this.state.barCodeScanned) {
            const barcodeUrl = JSON.stringify(data.data);
            this.setState({ barCodeScanned: true }, async () => {
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

    render() {
        if (this.state.hasCameraPermission) {
            return (
                <View style={{ flex: 1 }}>
                    <BarCodeScanner
                        onBarCodeScanned={this.handleBarCodeRead}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.overlay}>
                        <Ionicons style={styles.qrCodeScanner} size={280} name="ios-qr-scanner" />
                    </View>
                </View>
            );
        }
        return <Text> No camera view. Please give GreenToGo permission to access your camera so we can read QR codes! </Text>;
    }
}

export default BarCodeScannerReader;
