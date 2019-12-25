import React from 'react';
import { inject, observer } from 'mobx-react';
import {
    Content,
    List,
    Text,
} from 'native-base';
import styles from '../styles';
import ListMenuItem from './subcomponents/ListMenuItem';

@inject('appStore')
@observer
class GroupOrdersScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: this.props.navigation && this.props.navigation.state && this.props.navigation.state.params ? this.props.navigation.state.params.success : false,
        };
        this.goToNewGroupOrder = this.goToNewGroupOrder.bind(this);
        this.goToGroupOrder = this.goToGroupOrder.bind(this);
        this.props.appStore.getUserData();
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
                {this.state.success && <Text style={styles.boldCenteredText}>{this.state.success}</Text>}
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
