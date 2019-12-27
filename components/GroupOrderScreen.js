import React from 'react';
import { inject, observer } from 'mobx-react';
import {
    Container,
    Label,
    Item,
    Text,
    View,
    Picker,
    Header,
    Icon,
    Input,
    Spinner,
    Button,
    Content,
} from 'native-base';
import { StackActions } from 'react-navigation';
import {
    TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../apiClient';
import styles from '../styles';

@inject('appStore')
@observer
class GroupOrderScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            new: true,
            editDate: false,
            modified: false,
            error: undefined,
            loading: false,
            checked_in: false,
            checked_out: false,
            searchString: '',
            count: 1,
            date: new Date(),
            location: {},
            subscription: {},
        };
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.submit = this.submit.bind(this);
        this.buttonText = this.buttonText.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setRestaurant = this.setRestaurant.bind(this);
        this.delete = this.delete.bind(this);
        this.checkInOut = this.checkInOut.bind(this);
        this.toggleDate = this.toggleDate.bind(this);
        if (this.props.navigation.state.params.new) {
            this.state.new = true;
            this.state.subscription = this.props.appStore.user.subscriptions.find((sub) => sub.corporate_code && sub.is_active);
        }
        if (this.props.navigation.state.params.id) {
            const orderData = this.props.appStore.user.group_orders.find((order) => order.id === this.props.navigation.state.params.id);
            const splitDate = orderData.expected_checkout.split('-');
            const date = new Date();
            date.setFullYear(splitDate[0]);
            date.setMonth(splitDate[1] - 1);
            date.setDate(splitDate[2]);
            this.state = {
                new: false,
                ...orderData,
                date,
            };
        }
    }

    add() {
        this.setState((prevState) => ({ count: prevState.count + 1, modified: true }));
    }

    subtract() {
        if (this.state.count > 1) {
            this.setState((prevState) => ({ count: prevState.count - 1, modified: true }));
        }
    }

    submit() {
        if (this.state.deleting) {
            return this.setState({ deleting: false, error: undefined });
        }
        const { date } = this.state;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const options = {
            method: this.state.new ? 'post' : 'put',
            url: `/group/${this.state.new ? '' : this.state.id}`,
            data: {
                subscription_id: this.state.subscription.id,
                location_code: this.state.location.code,
                expected_checkout: `${year}-${month}-${day}`,
                count: this.state.count,
            },
        };
        return this.setState({ loading: true }, async () => {
            try {
                await axios(options);
                this.setState({ loading: false });
                this.props.navigation.dispatch(StackActions.pop({ n: 1 }));
                return this.props.navigation.dispatch(StackActions.replace({
                    routeName: 'grouporders',
                    params: { success: `Group Order successfully ${this.state.new ? 'added' : 'updated'}!` },
                }));
            } catch (error) {
                return this.setState({ loading: false, error: 'Unable to process order, please try again!' });
            }
        });
    }

    buttonText() {
        if (this.state.deleting) {
            return 'Cancel';
        }
        if (this.state.new) {
            return 'Submit Order';
        }
        return 'Update';
    }

    setDate(event, date) {
        this.setState({ date, modified: true });
    }

    setRestaurant(code) {
        const resturant = this.props.appStore.resturants.find((location) => location.code === code);
        this.setState({ location: resturant, searchString: '', modified: true });
    }

    toggleDate() {
        this.setState((prevState) => ({ editDate: !prevState.editDate }));
    }

    async delete() {
        if (this.state.deleting) {
            return this.setState({ loading: true }, async () => {
                try {
                    const options = {
                        method: 'delete',
                        url: `/group/${this.state.id}`,
                    };
                    await axios(options);
                    this.setState({ loading: false });
                    this.props.navigation.dispatch(StackActions.pop({ n: 1 }));
                    return this.props.navigation.dispatch(StackActions.replace({
                        routeName: 'grouporders',
                        params: { success: 'Canceled Order!' },
                    }));
                } catch (error) {
                    return this.setState({ loading: false, deleting: false, error: 'Unable to process deletion, please try again!' });
                }
            });
        }
        return this.setState({ deleting: true, error: 'Are you sure you want to cancel?' });
    }

    async checkInOut() {
        return this.setState({ loading: true }, async () => {
            try {
                const options = {
                    method: 'post',
                    url: `/${this.state.checked_out ? 'in' : 'out'}/group/${this.state.id}`,
                };
                await axios(options);
                this.setState({ loading: false });
                this.props.navigation.dispatch(StackActions.pop({ n: 1 }));
                return this.props.navigation.dispatch(StackActions.replace({
                    routeName: 'containerSuccessScreen',
                    params: { boxCount: this.state.count, locationData: this.state.location },
                }));
            } catch (error) {
                return this.setState({ loading: false, deleting: false, error: 'Backend failure, please try again!' });
            }
        });
    }

    static navigationOptions = {
        title: 'Group Order',
    };

    render() {
        const buttonText = this.buttonText();
        const deleteButtonText = this.state.deleting ? 'Confirm' : 'Cancel';
        const { date, searchString, location } = this.state;
        const checkOutLocations = this.props.appStore.resturants.filter((loc) => loc.service === 'OUT');
        const filteredResturants = searchString && searchString.length > 0 ? checkOutLocations.filter((loc) => loc.name.toLowerCase().includes(searchString.toLowerCase())) : checkOutLocations;
        const pickerItems = filteredResturants.map((loc) => (<Picker.Item label={loc.name} value={loc.code} />));
        const dateString = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const missingData = !date || !location.code;
        return (
            <Container>
                <View style={this.state.loading && styles.overlayLoading}>
                    {this.state.loading && <Spinner color="blue" />}
                </View>
                <Content>
                    <Text style={styles.boldCenteredText}>
                        Group Order Request
                    </Text>
                    {this.state.checked_in || this.state.checked_out ? (
                        <View style={styles.centeredRow}>
                            <Text style={styles.submissionBoxCountStyle}>{this.state.count}</Text>
                        </View>
                    ) : (
                            <View style={styles.centeredRow}>
                                <Button
                                    success
                                    onPress={this.subtract}
                                >
                                    <Text style={styles.submissionAddSubIcon}>-</Text>
                                </Button>
                                <Text style={styles.submissionBoxCountStyle}>{this.state.count}</Text>
                                <Button
                                    success
                                    onPress={this.add}
                                >
                                    <Text style={styles.submissionAddSubIcon}>+</Text>
                                </Button>
                            </View>
                        )}
                    <View style={styles.centeredRow}>
                        <Item>
                            <Label>
                                <Text>Restaurant</Text>
                            </Label>
                            <Picker
                                renderHeader={(backAction) => (
                                    <Header searchBar rounded style={styles.groupOrderSearchBar}>
                                        <Button transparent onPress={backAction}>
                                            <Icon name="arrow-back" style={{ color: '#fff' }} />
                                        </Button>
                                        <Item>
                                            <Icon name="ios-search" />
                                            <Input
                                                placeholder="Search"
                                                autoCorrect={false}
                                                onChangeText={(text) => this.setState({ searchString: text })}
                                                value={this.state.searchString}
                                            />
                                        </Item>
                                    </Header>
                                )}
                                mode="dropdown"
                                style={{ width: undefined }}
                                placeholder="Select Resturant"
                                selectedValue={this.state.location.code}
                                onValueChange={this.setRestaurant}
                                enabled={!this.state.checked_in && !this.state.checked_out}
                            >
                                {pickerItems}
                            </Picker>
                        </Item>
                    </View>
                    <View style={styles.centeredRow}>
                        <Item>
                            <TouchableOpacity onPress={this.toggleDate}>
                                <Label>
                                    <Text>Date</Text>
                                </Label>
                                <Text>{dateString}</Text>
                            </TouchableOpacity>
                        </Item>
                    </View>
                    {(!this.state.checked_in && !this.state.checked_out && this.state.editDate) && (
                        <DateTimePicker
                            value={this.state.date}
                            mode="date"
                            is24Hour={false}
                            display="default"
                            onChange={this.setDate}
                        />
                    )}
                    <View style={styles.centeredRow}>
                        {!this.state.new && (
                            <TouchableOpacity
                                style={styles.submissionSubmitButton}
                                onPress={this.checkInOut}
                            >
                                <Text style={styles.submissionSubmitTextStyle}>
                                    {this.state.checked_out ? 'Return Containers' : 'Check Out Boxes'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {this.state.error && <Text style={styles.errorStyle}>{this.state.error}</Text>}
                    {!this.state.checked_out && (
                        <View style={styles.centeredRow}>
                            {!this.state.new && (
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={this.delete}
                                >
                                    <Text style={styles.submissionSubmitTextStyle}>
                                        {deleteButtonText}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={missingData || !this.state.modified || this.state.loading ? styles.submissionSubmitButtonBlocked : styles.submissionSubmitButton}
                                onPress={missingData || !this.state.modified || this.state.loading ? null : this.submit}
                            >
                                <Text style={styles.submissionSubmitTextStyle}>
                                    {buttonText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Content>
            </Container>
        );
    }
}

export default GroupOrderScreen;
