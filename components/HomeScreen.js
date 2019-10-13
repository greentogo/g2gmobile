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
import G2GVideo from './subcomponents/G2GVideo';
import registerForPushNotificationsAsync from './subcomponents/pushNotification';


@inject('appStore')
@observer
class HomeScreen extends React.Component {
    static navigationOptions = {
        headerTitle: <G2GTitleImage />,
    };

    constructor(props) {
        super(props);
        this.props.appStore.getUserData();
        this.props.appStore.clearAndGetResturantData();
        this.goToMap = this.goToMap.bind(this);
        this.goToScanQRCode = this.goToScanQRCode.bind(this);
        this.goToAccount = this.goToAccount.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        registerForPushNotificationsAsync(this.props.appStore);
    }

    goToMap() {
        this.props.navigation.navigate('map');
    }

    goToScanQRCode() {
        this.props.navigation.navigate('scanQRCode');
    }

    goToAccount() {
        this.props.navigation.navigate('account');
    }

    logOut() {
        this.props.appStore.clearAuthToken();
    }

    // Profile, Rewards, Big button for scanning, Map/Locations List, Help

    render() {
        return (
            <View style={{ ...styles.container, paddingBottom: 50 }}>
                <ScrollView>
                    <G2GVideo />
                    <List>
                        <ListMenuItem
                            icon="swap-horiz"
                            color={styles.primaryCream}
                            backgroundColor="green"
                            text="Check In/Out container"
                            onPress={this.goToScanQRCode}
                        />
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

export default HomeScreen;
