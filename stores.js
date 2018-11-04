import { observable, action } from 'mobx';
import { enableLogging } from 'mobx-logger';
import simpleStore from 'react-native-simple-store';
import axios from './apiClient';

enableLogging({
    action: false,
    reaction: false,
    transaction: false,
    compute: false
});

export class AppStore {
    @observable authToken = '';
    @observable user = {};
    @observable currentRoute = 'home';
    @observable resturants = null;

    constructor() {
        // console.log('appStore constructor')
        simpleStore.get('authToken').then(token => {
            // console.log('stored token', token || 'not found')
            this.authToken = token
        });
        simpleStore.get('user').then(user => {
            // console.log('user store', user || 'not found')
            this.user = user
        });
    }

    reduceBoxes(subscriptions, type) {
        return subscriptions.reduce((sum, subscription) => sum + subscription[type], 0)
    }

    @action setAuthToken(token) {
        // console.log('setting authToken', token)
        this.authToken = token;
        simpleStore.save('authToken', token);
    }

    @action clearAuthToken() {
        // console.log('clearing authToken')
        this.authToken = null;
        simpleStore.save('authToken', null);
        simpleStore.save('user', null);
    }

    @action setCurrentRoute(navState) {
        if (navState.hasOwnProperty('routes') && navState.hasOwnProperty('index') && navState.routes[navState.index].hasOwnProperty('routeName')) {
            this.currentRoute = navState.routes[navState.index].routeName;
        }
    }

    @action getUserData() {
        // Get the user data after successful login
        axios.get('/me/', {
            headers: {
                'Authorization': `Token ${this.authToken}`
            }
        }).then((response) => {
            this.setUserData(response.data.data);
        }).catch((error) => {
            axios.post('/log/', { 'context': 'stores.js getUserData', 'error': error, 'message': error.message, 'stack': error.stack });
            this.clearAuthToken();
            // console.log(this.clearAuthToken());
        })
    }

    @action async getResturantData() {
        // Get the restaurant data on load
        try {
            const response = await axios.get('/restaurants/');
            this.resturants = response.data.data;
            return response.data.data;
        } catch (error) {
            axios.post('/log/', { 'context': 'stores.js getResturantData', 'error': error, 'message': error.message, 'stack': error.stack });
        }
    }

    @action clearAndGetResturantData() {
        this.resturants = null;
        this.getResturantData();
    }

    @action setUserData(data) {
        this.user = data;
        if (data.subscriptions) {
            this.user.maxBoxes = this.reduceBoxes(data.subscriptions, "max_boxes");
            this.user.availableBoxes = this.reduceBoxes(data.subscriptions, "available_boxes");
        }
        simpleStore.save('user', data);
    }
}
