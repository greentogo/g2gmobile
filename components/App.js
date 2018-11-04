import React from 'react';
import { Constants } from 'expo';
import { observer, Provider } from 'mobx-react';
import { createStackNavigator } from 'react-navigation';
import styles from '../styles';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import ScanQRCode from './ScanQRCode';
import SubmissionScreen from './SubmissionScreen';
import ContainerSuccessScreen from './ContainerSuccessScreen';
import AccountScreen from './AccountScreen';
import SubscriptionScreen from './SubscriptionScreen';
import EditNameEmailScreen from './EditNameEmailScreen';


const RootStack = createStackNavigator(
    {
        home: HomeScreen,
        map: MapScreen,
        scanQRCode: ScanQRCode,
        submission: SubmissionScreen,
        containerSuccessScreen: ContainerSuccessScreen,
        account: AccountScreen,
        subscription: SubscriptionScreen,
        editnameemail: EditNameEmailScreen,
    },
    {
        initialRouteName: 'home',
        navigationOptions: {
            headerStyle: {
                backgroundColor: styles.primaryColor,
            },
            headerTintColor: '#ffffff',
            tintColor: styles.primaryCream,
            borderTopWidth: Constants.statusBarHeight,
            headerTitleStyle: {
                color: '#ffffff',
                fontWeight: 'bold',
            },
        },
    },
);

@observer
class App extends React.Component {
    componentDidMount() {
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP); // eslint-disable-line no-undef
    }

    render() {
        const { store } = this.props;
        if (!store.authToken) {
            return <LoginScreen store={store} />;
        }
        return (
            <Provider appStore={store}>
                <RootStack
                    onNavigationStateChange={(prevState, newState) => {
                        store.setCurrentRoute(newState);
                    }}
                />
            </Provider>
        );
    }
}

export default App;
