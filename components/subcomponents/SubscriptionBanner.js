import React from 'react';
import { inject, observer } from 'mobx-react';
import { Text } from 'native-base';
import styles from '../../styles';

@inject('appStore')
@observer
class SubscriptionBanner extends React.Component {
    render() {
        let availableBoxes = '';
        let maxBoxes = '';
        let boxesAvailableBanner = '';
        if (this.props.appStore.user) {
            if (this.props.appStore.user.availableBoxes && this.props.appStore.user.subscriptions.length > 0) {
                availableBoxes = `${this.props.appStore.user.availableBoxes}`;
                maxBoxes = `${this.props.appStore.user.maxBoxes}`;
                boxesAvailableBanner = `${availableBoxes} / ${maxBoxes} boxes available`;
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
