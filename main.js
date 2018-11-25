import React from 'react';
import Expo from 'expo';
import { observer } from 'mobx-react';
import App from './components/App';
import { AppStore } from './stores';

const store = new AppStore();

@observer class GreenToGo extends React.Component {
    state = { loaded: true };

    // Uncomment for font loading
    // state = { loaded: false };

    // async componentDidMount() {
    //     await Expo.Font.loadAsync({
    //         Roboto: require('native-base/Fonts/Roboto.ttf'),
    //         Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //     });
    //     this.setState({ loaded: true });
    // }

    render() {
        if (this.state.loaded) {
            return (
                <App store={store} />
            );
        }
        return <Expo.AppLoading />;
    }
}

Expo.registerRootComponent(GreenToGo);
