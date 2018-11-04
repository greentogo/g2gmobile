import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { inject } from 'mobx-react';
import axios from '../apiClient';
import appJson from '../app.json';
import styles from '../styles';
import CommunityBoxes from './subcomponents/CommunityBoxes';

@inject('appStore')
class ContainerSuccessScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Check In/Out Success!',
        headerTitleStyle: { width: 300 },
        headerLeft: (
            <TouchableOpacity><Text style={styles.popToTopStyle} onPress={() => navigation.popToTop()}>X</Text></TouchableOpacity>
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            boxCount: this.props.navigation.state.params.boxCount,
            service: this.props.navigation.state.params.locationData.service,
            rating: -1,
            ratingSubmitted: false,
            time: new Date(),
        };
        this.props.appStore.getUserData();
    }

    rateApp = rating => () => {
        this.setState({ rating, ratingSubmitted: true });
        axios.post('/rate/', { rating, version: appJson.expo.version }, {
            headers: {
                Authorization: `Token ${this.props.appStore.authToken}`,
            },
        });
    }


    render() {
        let text = null;
        let rating = null;
        if (this.state.service === 'OUT') {
            text = this.state.ratingSubmitted ? 'Thank you!' : 'Rate your experience with GreenToGo!';
            rating = [1, 2, 3, 4, 5].map((num) => {
                const color = num <= this.state.rating ? 'gold' : 'white';
                const pressAction = this.state.ratingSubmitted ? null : this.rateApp(num);
                return (
                    <TouchableOpacity key={num}>
                        <MaterialIcons style={{ color }} onPress={pressAction} size={45} name="star" />
                    </TouchableOpacity>
                );
            });
        }
        return (
            <ScrollView style={styles.successTopContainer}>
                <View>
                    <Text style={styles.successText}>
                        Checked
                        {' '}
                        {this.state.service.toLowerCase()}
                    </Text>
                    <Text style={styles.successText}>
                        {this.state.boxCount === 1 ? '1 box' : `${this.state.boxCount} boxes`}
                    </Text>
                    {/* TODO: Give location name on successful checkOut and set it to state */
                    }
                    {/* <Text style={{color: '#628e86', textAlign: 'center', fontSize: 45}}>
                    {this.state.location ? "from " + this.state.location : ""}
                    </Text> */}
                    <Text style={styles.successDateTimeText}>
                        {this.state.time ? this.state.time.toLocaleTimeString() : ''}
                    </Text>
                    <Text style={styles.successDateTimeText}>
                        {this.state.time ? this.state.time.toLocaleDateString() : ''}
                    </Text>
                    <View style={styles.successImageContainer}>
                        <Image
                            source={require('../assets/icons/GTG-Box-App.png')}
                            style={styles.successImage}
                        />
                    </View>
                </View>
                <Text style={styles.successDateTimeText}>{text}</Text>
                <View style={styles.centeredRow}>
                    {rating}
                </View>
                <CommunityBoxes color="white" background={styles.primaryColor} />
            </ScrollView>
        );
    }
}

export default ContainerSuccessScreen;
