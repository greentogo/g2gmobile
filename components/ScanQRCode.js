import React from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import BarCodeScannerReader from './subcomponents/BarCodeScannerReader';

@inject('appStore')
@observer
class ScanQRCode extends React.Component {
    static navigationOptions = {
        title: 'Scan QR Code',
    };

    navigateNext = (locationData) => {
        this.props.navigation.navigate('submission', { locationData });
    };

    // uncomment to skip
    // componentDidMount() {
    //     this.props.navigation.navigate('submission', { locationData: {
    //         code: 'GW6VRU',
    //         service: 'OUT',
    //         name: "Rose's Noodles, Dumplings & Sweets"
    //     } });
    // }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <BarCodeScannerReader navigateNext={this.navigateNext} />
            </View>
        );
    }
}

export default ScanQRCode;
