import React from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import {
    List,
} from 'native-base';
import axios from '../apiClient';
import styles from '../styles';
import ListMenuItem from './subcomponents/ListMenuItem';
import SubscriptionBanner from './subcomponents/SubscriptionBanner';
import G2GTitleImage from './subcomponents/G2GTitleImage';
import registerForPushNotificationsAsync from './subcomponents/pushNotification';

@inject('appStore')
@observer
class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.appStore.user,
            totalBoxesReturned: false,
        };
        this.props.appStore.getUserData();
        this.props.appStore.getResturantData();
        this.props.appStore.attemptOfflineTags();
        this.goToMap = this.goToMap.bind(this);
        this.goToScanQRCode = this.goToScanQRCode.bind(this);
        this.goToGroupOrders = this.goToGroupOrders.bind(this);
        this.goToAccount = this.goToAccount.bind(this);
        this.logOut = this.logOut.bind(this);
        this.goToLocationSelect = this.goToLocationSelect.bind(this);
    }

    async componentDidMount() {
        registerForPushNotificationsAsync(this.props.appStore);
        try {
            // TODO Is this axios call really necessary?
            const response = await axios.get(`/stats/${this.props.appStore.user.username}/`);
            if (response.data && response.data.data) {
                this.setState({
                    totalBoxesReturned: response.data.data.total_boxes_returned,
                });
            }
        } catch (error) {
            axios.log('CommunityBoxes.js', error);
            if ((error.status && error.status === 401) || (error.response && error.response.status && error.response.status === 401)) {
                this.props.appStore.clearAuthToken();
            }
        }
    }

    static navigationOptions = {
        headerTitle: <G2GTitleImage />,
    };

    goToLocationSelect() {
        this.props.navigation.navigate('locationSelect');
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

    goToMap() {
        this.props.navigation.navigate('map');
    }

    logOut() {
        this.props.appStore.clearAuthToken();
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
                            text="Check-Out Container(s)"
                            onPress={this.goToLocationSelect}
                        />
                        <ListMenuItem
                            icon="swap-horiz"
                            color={styles.primaryCream}
                            backgroundColor="green"
                            text="Return Container"
                            onPress={this.goToScanQRCode}
                        />
                        <ListMenuItem
                            icon="map"
                            color={styles.primaryCream}
                            backgroundColor="red"
                            text="Map of restaurants"
                            onPress={this.goToMap}
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

export default HomeScreen;
