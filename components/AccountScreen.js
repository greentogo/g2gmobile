import React from 'react';
import {
    WebView,
    Linking,
} from 'react-native';
import { inject, observer } from "mobx-react";
import styles from "../styles";
import {
    Content,
    List,
} from "native-base";
import ListMenuItem from './subcomponents/ListMenuItem';
import SubscriptionBanner from './subcomponents/SubscriptionBanner';
import CommunityBoxes from "./subcomponents/CommunityBoxes";

@inject("appStore")
@observer
class AccountScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.props.appStore.user,
            redirectToWeb: false
        }
    }

    static navigationOptions = {
        title: 'Account',
    };

    goToNameAndEmail = () => {
        this.props.navigation.navigate('editnameemail');
    }

    render() {
        if (this.state.redirectToWeb) {
            let uri = this.state.redirectToWeb;
            return (
                <WebView
                    ref={(ref) => { this.webview = ref; }}
                    source={{ uri }}
                    onNavigationStateChange={(event) => {
                        this.setState({ redirectToWeb: false })
                        Linking.openURL(event.url);
                        this.webview.stopLoading();
                    }}
                />
            );
        } else {
            return (
                <Content style={styles.container}>
                    <List>
                        <ListMenuItem
                            icon="person"
                            text="View/Edit Name and Email"
                            onPress={this.goToNameAndEmail}
                        />
                        <ListMenuItem
                            icon="credit-card"
                            text="Update payment method"
                            onPress={() => { this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/account/change_payment_method/' }) }}
                        />
                        <ListMenuItem
                            icon="inbox"
                            text="View/Edit Subscriptions"
                            onPress={() => { this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/subscriptions/' }) }}
                        />
                        <ListMenuItem
                            icon="lock"
                            text="Change Password"
                            onPress={() => { this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/account/change_password/' }) }}
                        />
                    </List>
                    <SubscriptionBanner />
                    <CommunityBoxes />
                </Content>
            )
        }
    }
}

export default AccountScreen;
