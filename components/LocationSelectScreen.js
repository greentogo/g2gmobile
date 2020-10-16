import React from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import {
    List,
} from 'native-base';
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
    constructor(props) {
        super(props);
        this.state = {
            cameraMode: true,
            error: undefined,
            codeInput: '',
            barCodeScanned: false,
            hasCameraPermission: false,
            flashMode: 'off',
            restraunts: null,
        };

        this.props.appStore.getUserData();
        this.props.appStore.getResturantData();
        this.props.appStore.attemptOfflineTags();
        // this.goToMap = this.goToMap.bind(this);
        this.goToScanQRCode = this.goToScanQRCode.bind(this);
        this.goToGroupOrders = this.goToGroupOrders.bind(this);
        this.goToAccount = this.goToAccount.bind(this);
        this.logOut = this.logOut.bind(this);
        this.checkCode = this.checkCode.bind(this);
    }

    async componentDidMount() {
        this.setState({ resturants: this.props.appStore.resturants || await this.props.appStore.getResturantData() });
        console.log(this.state.restraunts)
    }

    static navigationOptions = {
        headerTitle: <G2GTitleImage />,
    };


    goToLocationSelect() {
        this.props.navigation.navigate('map');
    }

    goToScanQRCode() {
        this.props.navigation.navigate('scanQRCode');
    }

    goToGroupOrders() {
        this.props.navigation.navigate('grouporders');
    }

    goToAccount() {
        this.props.navigation.navigate('account');
    }

    logOut() {
        this.props.appStore.clearAuthToken();
    }
async s
    async checkCode(code) {
        const resturants = this.props.appStore.resturants || await this.props.appStore.getResturantData();
        console.log('restraunts ', resturants);
        // try {
        //     const url = `/locations/${code}`;
        //     const response = await axios.get(url);
        //     if (response.data && response.data.data && response.data.data.code) {
        //         this.navigateNext(response.data.data);
        //     } else {
        //         this.setState({ barCodeScanned: false, error: 'Invalid Code' });
        //     }
        // } catch (error) {
        //     if (error.code === 'ECONNABORTED' && this.props.appStore.resturants) {
        //         const locationData = this.props.appStore.resturants.find((location) => location.code === code);
        //         if (locationData) {
        //             this.navigateNext(locationData);
        //         } else {
        //             this.setState({ barCodeScanned: false, error: 'Invalid Code' });
        //         }
        //     } else if (!error.response || !error.response.status || error.response.status !== 404) {
        //         this.setState({ barCodeScanned: false, error: 'Error reading code' });
        //         axios.log('ScanQRCode.js', error);
        //     } else {
        //         this.setState({ barCodeScanned: false, error: 'Invalid Code' });
        //     }
        // }
    }

    // Profile, Rewards, Big button for scanning, Map/Locations List, Help

    render() {
        return (
            <View style={{ ...styles.container, paddingBottom: 50 }}>
                <ScrollView>
                    {/* <G2GVideo /> */}
                    <List>
                        <ListMenuItem
                            icon="swap-horiz"
                            color={styles.primaryCream}
                            backgroundColor="green"
                            text="Check In container"
                            onPress={this.goToScanQRCode}
                        />
                        <ListMenuItem
                            icon="swap-horiz"
                            color={styles.primaryCream}
                            backgroundColor="green"
                            text="Check Out container"
                            onPress={this.goToScanQRCode}
                        />
                        {this.props.appStore && this.props.appStore.user && this.props.appStore.user.is_corporate_user
                            && (
                                <ListMenuItem
                                    icon="group"
                                    color={styles.primaryCream}
                                    backgroundColor="green"
                                    text="Group Orders"
                                    onPress={this.goToGroupOrders}
                                />
                            )}
                        <ListMenuItem
                            icon="map"
                            color={styles.primaryCream}
                            backgroundColor="red"
                            text="Map of restaurants"
                            onPress={this.goToMap}
                        />
                        <ListMenuItem
                            icon="person"
                            text="Your account"
                            onPress={this.goToAccount}
                        />
                        <ListMenuItem
                            icon="lock"
                            text="Log out"
                            onPress={this.logOut}
                        />
                    </List>
                </ScrollView>
                <View style={styles.bottomFixed}>
                    <SubscriptionBanner />
                </View>
            </View>
        );
    }
}

export default LocationSelectScreen;
