import React from 'react';
import {
    Platform, ImageBackground, Text, View, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';
import Flashing from './subcomponents/Flashing';
import styles from '../styles';
import axios from '../apiClient';

@inject('appStore')
@observer
class MapScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        let titleText = 'Participating Restaurants';
        if (state.params && state.params.title) {
            titleText = state.params.title;
        }
        return {
            title: `${titleText}`,
            headerTitleStyle: { width: 300 },
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            mapType: 'OUT',
            error: false,
            resturants: [],
            currentLocation: false,
        };
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }

    async componentDidMount() {
        try {
            this.getCurrentLocation();
            const resturants = this.props.appStore.resturants || await this.props.appStore.getResturantData();
            this.setState({ resturants });
        } catch (error) {
            this.setState({ error: true });
            axios.log('MapScreen.js componentDidMount', error);
        }
        // this._interval = setInterval(() => {
        //     this.getCurrentLocation();
        // }, 5000);
    }

    componentWillUnmount() {
        // clearInterval(this._interval);
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(((user) => { // eslint-disable-line no-undef
            this.setState({ currentLocation: user.coords });
        }));
    }

    switchService = (type, titleText) => () => {
        this.setState({ mapType: type });
        const { setParams } = this.props.navigation;
        setParams({ title: titleText });
    }

    goToLocation = (latitude, longitude, title) => () => {
        openMap({
            latitude, longitude, query: title, end: title,
        });
    }

    render() {
        if (this.state.error) {
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorStyle}>Sorry, we are unable to retrieve resturant data, please try again later.</Text>
                </View>
            );
        }
        const markers = this.state.resturants.reduce((accumulator, resturant) => {
            if (resturant.address && resturant.latitude && resturant.longitude && resturant.service === this.state.mapType) {
                accumulator.push(
                    <MapView.Marker
                        coordinate={{
                            latitude: resturant.latitude,
                            longitude: resturant.longitude,
                        }}
                        key={`${resturant.latitude}${resturant.longitude}${resturant.name.replace(/\s/g, '')}${resturant.service}`}
                        ref={this[`callout-${resturant.latitude}${resturant.longitude}${resturant.name.replace(/\s/g, '')}${resturant.service}`]}
                    >
                        {Platform.OS === 'ios' && (
                            <ImageBackground
                                source={require('../assets/icons/Drop-Pin_Box.png')}
                                style={{ height: 75, width: 75, zIndex: 1 }}
                            />
                        )}
                        <MapView.Callout
                            style={{ width: 300, zIndex: 9999 }}
                            onPress={this.goToLocation(resturant.latitude, resturant.longitude, resturant.name)}
                        >
                            <Text numberOfLines={1} style={styles.mapCalloutTitle}>{resturant.name}</Text>
                            <Text numberOfLines={1} style={styles.mapCalloutText}>{resturant.address}</Text>
                            <Text numberOfLines={1} style={styles.mapCalloutDirections}>Tap for directions!</Text>
                        </MapView.Callout>
                    </MapView.Marker>,
                );
            }
            return accumulator;
        }, []);
        if (markers) {
            return (
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: 35.9940,
                            longitude: -78.8986,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        {this.state.currentLocation
                            && (
                                <MapView.Marker
                                    coordinate={{
                                        latitude: this.state.currentLocation.latitude,
                                        longitude: this.state.currentLocation.longitude,
                                    }}
                                    title="You"
                                    key="You"
                                >
                                    <Flashing>
                                        <ImageBackground
                                            source={require('../assets/icons/you.png')}
                                            style={{ height: 15, width: 15 }}
                                        />
                                    </Flashing>
                                </MapView.Marker>
                            )
                        }
                        {markers}
                    </MapView>
                    <View style={styles.bottomFixed}>
                        <TouchableOpacity onPress={this.switchService('OUT', 'Participating Restaurants')}>
                            <Text style={styles.subscriptionBanner}>Participating Restaurants</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.switchService('IN', 'Return A Box')}>
                            <Text style={styles.subscriptionBanner}>Return Box</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
}

export default MapScreen;
