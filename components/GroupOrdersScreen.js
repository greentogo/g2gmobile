import React from 'react';
import { inject, observer } from 'mobx-react';
import {
    Content,
    List,
} from 'native-base';
import styles from '../styles';
import ListMenuItem from './subcomponents/ListMenuItem';

@inject('appStore')
@observer
class GroupOrdersScreen extends React.Component {
    constructor(props) {
        super(props);
        this.goToNewGroupOrder = this.goToNewGroupOrder.bind(this);
        this.goToGroupOrder = this.goToGroupOrder.bind(this);
    }

    goToNewGroupOrder() {
        this.props.navigation.navigate('grouporder', { new: true });
    }

    goToGroupOrder(id) {
        this.props.navigation.navigate('grouporder', { id });
    }

    static navigationOptions = {
        title: 'Group Orders',
    };

    render() {
        const orders = this.props.appStore && this.props.appStore.user && this.props.appStore.user.group_orders
            ? this.props.appStore.user.group_orders.map((order) => (
                <ListMenuItem
                    key={`${order.location.name} - ${order.expected_checkout}`}
                    icon="update"
                    text={`${order.location.name} - ${order.expected_checkout}`}
                    onPress={() => this.goToGroupOrder(order.id)}
                />
            ))
            : '';
        return (
            <Content style={styles.container}>
                <List>
                    <ListMenuItem
                        icon="add"
                        text="Add New Group Order"
                        onPress={this.goToNewGroupOrder}
                    />
                    {orders}
                </List>
            </Content>
        );
    }
}

export default GroupOrdersScreen;
