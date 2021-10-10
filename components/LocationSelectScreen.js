import React from 'react';
import {
    View, Text, ScrollView, Picker, TouchableOpacity 
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { Button, List } from 'native-base';
import styles from '../styles';
import ListMenuItem from './subcomponents/ListMenuItem';
import SubscriptionBanner from './subcomponents/SubscriptionBanner';
import G2GTitleImage from './subcomponents/G2GTitleImage';
import axios from '../apiClient';

import G2GVideo from './subcomponents/G2GVideo';
import registerForPushNotificationsAsync from './subcomponents/pushNotification';


@inject('appStore')
@observer
class LocationSelectScreen extends React.Component {
    static navigationOptions = {
    };

    constructor(props) {
        super(props);
        this.state = {
            // cameraMode: true,
            // error: undefined,
            // codeInput: '',
            // barCodeScanned: false,
            // hasCameraPermission: false,
            // flashMode: 'off',
            CheckoutLocations: [],
        };

        this.props.appStore.getUserData();
        this.props.appStore.getRestaurantData();
        this.props.appStore.attemptOfflineTags();
        this.goToScanQRCode = this.goToScanQRCode.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
        this.checkCode = this.checkCode.bind(this);
    }

    async componentDidMount() {
        const restaurants = this.props.appStore.restaurants || await this.props.appStore.getRestaurantData();
        const CheckoutLocations = restaurants.filter((e) => e.service === 'OUT');
        this.setState({ CheckoutLocations }, () => {
            console.log('CheckoutLocations', this.state.CheckoutLocations);
        });
    }

    navigateNext(locationData) {
        this.props.navigation.replace('submission', { locationData });
    }

    handleCodeSubmit() {
        console.log('handleCodeSubmit');
        if (this.state.selectedLocation && this.state.selectedLocation.length > 0) {
            this.setState({ barCodeScanned: true, flashMode: 'off', error: undefined }, async () => {
                this.checkCode(this.state.selectedLocation);
            });
        }
    }

    async checkCode(code) {
        console.log('checkCode');

        try {
            const url = `/locations/${code}`;
            const response = await axios.get(url);
            if (response.data && response.data.data && response.data.data.code) {
                this.navigateNext(response.data.data);
            } else {
                this.setState({ barCodeScanned: false, error: 'Invalid Code' });
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED' && this.props.appStore.restaurants) {
                const locationData = this.state.CheckoutLocations.find((location) => location.code === code);
                if (locationData) {
                    this.navigateNext(locationData);
                } else {
                    this.setState({ barCodeScanned: false, error: 'Invalid Code' });
                }
            } else if (!error.response || !error.response.status || error.response.status !== 404) {
                this.setState({ barCodeScanned: false, error: 'Error reading code' });
                axios.log('ScanQRCode.js', error);
            } else {
                this.setState({ barCodeScanned: false, error: 'Invalid Code' });
            }
        }
    }

    goToScanQRCode() {
        this.props.navigation.navigate('scanQRCode');
    }

    render() {
        return (
            <View style={{ ...styles.container, paddingBottom: 50}}>
            <View style={{height:100, justifyContent:'center'}}>
              <Text style={{ ...styles.communityBoxesText }}> Choose Restaurant </Text>
            </View>
                <Picker
                    selectedValue={this.state.selectedLocation}
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedLocation: itemValue }, () => {
                        console.log('selectedLocation', this.state.selectedLocation);
                    })}
                    >{
                        this.state.CheckoutLocations.map((v) => <Picker.Item label={v.name} value={v.code} />)
                    }
                </Picker>
                <View style={styles.centeredRow, {height:200, alignItems:'center'}}>
                    <Button success onPress={this.handleCodeSubmit}>
                        <Text style={styles.submissionSubmitTextStyle}> Next </Text>
                    </Button>
                </View>
                <View style={styles.bottomFixed}>
                    <TouchableOpacity style={{justifyContent:"center", alignItems:'center', flex:1}} onPress={this.goToScanQRCode}>
                        <Text style={{color:"Black", fontSize:20, paddingBottom:10}}> Or click to scan QR code </Text>
                    </TouchableOpacity>                    
                    <SubscriptionBanner />
                </View>
            </View>
        );
    }
}

export default LocationSelectScreen;
