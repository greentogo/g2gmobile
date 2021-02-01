import React from 'react';
import {
    Linking, View, ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { inject, observer } from 'mobx-react';
import {
    List,
} from 'native-base';
import styles from '../styles';
import ListMenuItem from './subcomponents/ListMenuItem';
import SubscriptionBanner from './subcomponents/SubscriptionBanner';
import CommunityBoxes from './subcomponents/CommunityBoxes';

@inject('appStore')
@observer
class AccountScreen extends React.Component {
    static navigationOptions = {
        title: 'Account',
    };

    constructor(props) {
        super(props);
        this.state = {
            redirectToWeb: false,
        };
        this.goToNameAndEmail = this.goToNameAndEmail.bind(this);
        this.goToUpdatePaymentMethod = this.goToUpdatePaymentMethod.bind(this);
        this.goToEditSubscriptions = this.goToEditSubscriptions.bind(this);
        this.goToChangePassword = this.goToChangePassword.bind(this);
    }


    goToNameAndEmail() {
        this.props.navigation.navigate('editnameemail');
    }

    goToUpdatePaymentMethod() {
        this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/account/change_payment_method/' });
    }

    goToEditSubscriptions() {
        this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/subscriptions/' });
    }

    goToChangePassword() {
        this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/account/change_password/' });
    }

    render() {
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
        return (
            <View style={styles.container}>
                <ScrollView alwaysBounceVertical={false}>
                    <List>
                        <ListMenuItem
                            icon="person"
                            text="View/Edit Name and Email"
                            onPress={this.goToNameAndEmail}
                        />
                        <ListMenuItem
                            icon="credit-card"
                            text="Update payment method"
                            onPress={this.goToUpdatePaymentMethod}
                        />
                        <ListMenuItem
                            icon="inbox"
                            text="View/Edit Subscriptions"
                            onPress={this.goToEditSubscriptions}
                        />
                        <ListMenuItem
                            icon="lock"
                            text="Change Password"
                            onPress={this.goToChangePassword}
                        />
                    </List>
                    <CommunityBoxes />
                </ScrollView>
                <SubscriptionBanner />

            </View>
        );
    }
}

export default AccountScreen;
