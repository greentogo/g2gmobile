import React from 'react';
import { Button } from 'native-base';
import { inject, observer } from 'mobx-react';
import {
    Text,
    View,
    Picker,
    WebView,
    Linking,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import axios from '../apiClient';
import styles from '../styles';

@inject('appStore')
@observer
class SubmissionScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Check In/Out',
        headerLeft: (
            <TouchableOpacity><Text style={styles.popToTopStyle} onPress={() => navigation.popToTop()}>X</Text></TouchableOpacity>
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingSubmit: false,
            error: false,
            subscriptions: [],
            subscriptionId: false,
            selectedSubscription: false,
            boxCount: 1,
            locationData: this.props.navigation.state.params.locationData,
        };
    }

    async componentDidMount() {
        const { subscriptions } = await this.props.appStore.getUserData();
        this.setState({ subscriptions, loading: false }, () => {
            if (this.state.subscriptions.length > 0) {
                this.subscriptionChange(this.state.subscriptions[0].id);
            }
        });
    }

    add = () => {
        const availableBoxes = this.state.selectedSubscription.available_boxes;
        const maxReturnableBoxes = this.state.selectedSubscription.max_boxes - availableBoxes;
        const { service } = this.state.locationData;
        if ((service === 'IN' && this.state.boxCount < maxReturnableBoxes)
            || (service === 'OUT' && this.state.boxCount < availableBoxes)) {
            this.setState((prevState) => ({ boxCount: prevState.boxCount + 1 }));
        }
    }

    subtract = () => {
        if (this.state.boxCount > 1) {
            this.setState((prevState) => ({ boxCount: prevState.boxCount - 1 }));
        }
    }

    subscriptionChange = (subscriptionId) => {
        let boxCount = 1;
        let error = false;
        let selectedSubscription;
        this.state.subscriptions.forEach((subscription) => {
            if (subscription.id === subscriptionId) {
                selectedSubscription = subscription;
            }
        });
        if (this.state.locationData.service === 'IN') {
            if (selectedSubscription.available_boxes >= selectedSubscription.max_boxes) {
                boxCount = 0;
                error = 'You have checked in all of your boxes for this subscription';
            }
        } else if (this.state.locationData.service === 'OUT') {
            if (selectedSubscription.available_boxes === 0) {
                boxCount = 0;
                error = 'You have checked out all of your boxes for this subscription';
            }
        }
        this.setState({
            error,
            subscriptionId,
            boxCount,
            selectedSubscription,
        });
    }

    submit = () => {
        // uncomment to skip
        // this.props.navigation.navigate('containerSuccessScreen', { boxCount: this.state.boxCount, locationData: this.state.locationData });
        if (!this.state.loadingSubmit) {
            try {
                this.setState({ loadingSubmit: true }, async () => {
                    const body = {
                        subscription: this.state.subscriptionId,
                        location: this.state.locationData.code,
                        action: this.state.locationData.service,
                        number_of_boxes: this.state.boxCount,
                    };
                    await axios.post('/tag/', body);
                    this.props.navigation.replace('containerSuccessScreen', { boxCount: this.state.boxCount, locationData: this.state.locationData });
                });
            } catch (error) {
                this.setState({ loadingSubmit: false });
                axios.log('SubmissionScreen.js Submit Tag', error);
            }
        }
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
        if (this.state.loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        if (this.state.subscriptions.length === 0) {
            return (
                <View style={styles.container}>
                    <Button light full onPress={() => { this.setState({ redirectToWeb: 'https://app.durhamgreentogo.com/subscriptions/new/' }); }}>
                        <Text style={styles.boldCenteredText}>
                            Your account has no subscriptions. Tap here to add a subscription.
                        </Text>
                    </Button>
                </View>
            );
        }
        return (
            <View style={styles.submissionContainer}>
                {/* TODO: Add this back in once the tag/ endpoint accepts # of boxes */}
                <View>
                    <Text style={styles.boldCenteredText}>{this.state.locationData.name}</Text>
                    <Text style={styles.boldCenteredText}>
                        How many boxes to do you want to check
                        {this.state.locationData.service.toLowerCase()}
                        ?
                    </Text>
                </View>
                <View style={styles.centeredRow}>
                    <Button
                        success
                        onPress={this.subtract}
                    >
                        <Text style={styles.submissionAddSubIcon}>-</Text>
                    </Button>
                    <Text style={styles.submissionBoxCountStyle}>{this.state.boxCount}</Text>
                    <Button
                        success
                        onPress={this.add}
                    >
                        <Text style={styles.submissionAddSubIcon}>+</Text>
                    </Button>
                </View>
                <View style={styles.pickerStyle}>
                    <Picker
                        mode="dialog"
                        selectedValue={this.state.subscriptionId}
                        onValueChange={(itemValue) => this.subscriptionChange(itemValue)}
                    >
                        {
                            this.state.subscriptions.map((subscription) => (
                                <Picker.Item
                                    key={`${subscription.id}`}
                                    label={`${subscription.name} (${subscription.available_boxes}/${subscription.max_boxes})`}
                                    value={subscription.id}
                                />
                            ))
                        }
                    </Picker>
                </View>
                <View>
                    <View style={styles.centeredRow}>
                        <Text style={styles.errorStyle}>{this.state.error}</Text>
                    </View>
                    <View style={styles.centeredRow}>
                        <TouchableOpacity style={this.state.error ? styles.submissionSubmitButtonBlocked : styles.submissionSubmitButton} onPress={this.state.error ? null : this.submit}>
                            <Text style={styles.submissionSubmitTextStyle}>
                                {this.state.error && 'Cannot '}
                                Check
                                {this.state.locationData.service.toLowerCase()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default SubmissionScreen;
