import { observable, action } from 'mobx';
import simpleStore from 'react-native-simple-store';
import axios from './apiClient';

/* eslint-disable import/prefer-default-export */

export class AppStore {
    @observable authToken = '';

    @observable user = {};

    @observable currentRoute = 'home';

    @observable resturants = null;

    constructor() {
        // console.log('appStore constructor')
        simpleStore.get('authToken').then((token) => {
            // console.log('stored token', token || 'not found')
            this.setAuthToken(token);
            this.authToken = token;
        });
        simpleStore.get('user').then((user) => {
            // console.log('user store', user || 'not found')
            this.user = user;
        });
    }

    reduceBoxes(subscriptions, type) {
        return subscriptions.reduce((sum, subscription) => {
            if (subscription.is_active) {
                return sum + subscription[type];
            }
            return sum;
        }, 0)
    }

    @action setAuthToken(token) {
        // console.log('setting authToken', token)
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        this.authToken = token;
        simpleStore.save('authToken', token);
    }

    @action clearAuthToken() {
        // console.log('clearing authToken')
        axios.defaults.headers.common.Authorization = '';
        this.authToken = null;
        simpleStore.save('authToken', null);
        simpleStore.save('user', null);
    }

    @action setCurrentRoute(navState) {
        if (navState && typeof navState.index === 'number'
            && navState.routes
            && navState.routes[navState.index]
            && navState.routes[navState.index].routeName) {
            this.currentRoute = navState.routes[navState.index].routeName;
        }
    }

    @action async getUserData() {
        // Get the user data after successful login
        try {
            const config = {
                headers: {
                    Authorization: `Token ${this.authToken}`,
                },
            };
            const response = await axios.get('/me/', config);
            return this.setUserData(response.data.data);
        } catch (error) {
            axios.log('stores.js getUserData', error);
            return this.clearAuthToken();
        }
    }

    @action async getResturantData() {
        // Get the restaurant data on load
        try {
            const response = await axios.get('/restaurants/');
            this.resturants = response.data.data;
            return response.data.data;
        } catch (error) {
            axios.log('stores.js getResturantData', error);
            throw error;
        }
    }

    @action clearAndGetResturantData() {
        this.resturants = null;
        this.getResturantData();
    }

    @action async setUserData(data) {
        this.user = data;
        if (data.subscriptions) {
            this.user.maxBoxes = this.reduceBoxes(data.subscriptions, 'max_boxes');
            this.user.availableBoxes = this.reduceBoxes(data.subscriptions, 'available_boxes');
        }
        simpleStore.save('user', data);
        return data;
    }
}
