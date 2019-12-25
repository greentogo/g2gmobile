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
            editing: false,
            loading: false,
            checked_in: false,
            checked_out: false,
            searchString: '',
            count: 1,
            date: new Date(),
            expected_checkout: undefined,
            location: {},

        };
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.submit = this.submit.bind(this);
        this.buttonText = this.buttonText.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setRestaurant = this.setRestaurant.bind(this);
        if (this.props.navigation.state.params.new) {
            this.state.new = true;
            this.state.editing = false;
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
        this.setState((prevState) => ({ count: prevState.count + 1 }));
    }

    subtract() {
        if (this.state.count > 1) {
            this.setState((prevState) => ({ count: prevState.count - 1 }));
        }
    }

    submit() {
        // uncomment to skip
        // this.props.navigation.navigate('containerSuccessScreen', { boxCount: this.state.boxCount, locationData: this.state.locationData });
        const { date } = this.state;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const options = {
            method: 'post',
            url: '/group/',
            data: {
                subscription_id: this.state.subscription.id,
                location_code: this.state.location.code,
                expected_checkout: `${year}-${month}-${day}`,
                count: this.state.count,
            },
        };
        this.setState({ loading: true }, async () => {
            try {
                await axios(options);
                this.setState({ loading: false });
            } catch (error) {
                this.setState({ loading: false });
            }
        });
    }

    buttonText() {
        if (this.state.new) {
            return 'Send Order';
        }
        return 'Update Order';
    }

    setDate(event, date) {
        this.setState({ date });
    }

    setRestaurant(code) {
        const resturant = this.props.appStore.resturants.find((location) => location.code === code);
        this.setState({ location: resturant, searchString: '' });
    }

    static navigationOptions = {
        title: 'Group Order',
    };

    render() {
        const buttonText = this.buttonText();
        const { date, searchString } = this.state;
        const checkOutLocations = this.props.appStore.resturants.filter((location) => location.service === 'OUT');
        const filteredResturants = searchString && searchString.length > 0 ? checkOutLocations.filter((location) => location.name.toLowerCase().includes(searchString.toLowerCase())) : checkOutLocations;
        const pickerItems = filteredResturants.map((location) => (<Picker.Item label={location.name} value={location.code} />));
        const dateString = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return (
            <Container>
                <View style={this.state.loading && styles.overlayLoading}>
                    {this.state.loading && <Spinner color="blue" />}
                </View>
                <Content>
                    <Text style={styles.boldCenteredText}>
                        Group Order Request
                    </Text>
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
                    <View style={styles.centeredRow}>
                        <Item inlineLabel>
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
                            >
                                {pickerItems}
                            </Picker>
                        </Item>
                    </View>
                    <View style={styles.centeredRow}>
                        <Item inlineLabel>
                            <Label>
                                <Text>Date</Text>
                            </Label>
                            <Text>{dateString}</Text>
                        </Item>
                    </View>
                    <DateTimePicker
                        value={this.state.date}
                        mode="date"
                        is24Hour={false}
                        display="default"
                        onChange={this.setDate}
                    />
                    <View style={styles.centeredRow}>
                        <TouchableOpacity
                            style={this.state.error || this.state.loading ? styles.submissionSubmitButtonBlocked : styles.submissionSubmitButton}
                            onPress={this.state.error || this.state.loading ? null : this.submit}
                        >
                            <Text style={styles.submissionSubmitTextStyle}>
                                {buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default GroupOrderScreen;
