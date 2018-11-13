import React from 'react';
import { inject, observer } from 'mobx-react';
import { Text } from 'native-base';
import styles from '../../styles';

@inject('appStore')
@observer
class SubscriptionBanner extends React.Component {
    render() {
        let boxesAvailableBanner = '';
        if (this.props.appStore && this.props.appStore.user && this.props.appStore.user.subscriptions) {
            if (this.props.appStore.user.availableBoxes
                && this.props.appStore.user.subscriptions.length > 0) {
                boxesAvailableBanner = `${this.props.appStore.user.availableBoxes} / ${this.props.appStore.user.maxBoxes} boxes available`;
            } else if (this.props.appStore.user.subscriptions.length === 0) {
                boxesAvailableBanner = 'You do not have a Subscription.';
            }
        }
        return (
            <Text style={styles.subscriptionBanner}>
                {boxesAvailableBanner}
            </Text>
        );
    }
}

export default SubscriptionBanner;
