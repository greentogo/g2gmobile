import React from 'react';
import {
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { ScreenOrientation } from 'expo';
import { Video } from 'expo-av';
import VideoPlayer from './VideoPlayer';

@inject('appStore')
@observer
class G2GVideo extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: null,
        tabBarVisible:
            !(navigation.state.params && navigation.state.params.tabBarHidden),
    });

    constructor(props) {
        super(props);
        this.state = {
            mute: false,
            shouldPlay: false,
            videoStarted: false,
            isPortrait: true,
        };
    }

    async componentDidMount() {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT_UP); // Use This to get it to work: // ScreenOrientation.lockAsync(ScreenOrientation.Orientation.ALL);
        Dimensions.addEventListener(
            'change',
            this.orientationChangeHandler.bind(this),
        );
    }

    async componentWillUnmount() {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
        Dimensions.removeEventListener('change', this.orientationChangeHandler);
    }

    handlePlayAndPause = () => {
        this.setState(prevState => ({
            shouldPlay: !prevState.shouldPlay,
        }));
    }

    handleVolume = () => {
        this.setState(prevState => ({
            mute: !prevState.mute,
        }));
    }

    switchToLandscape = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);
    }

    switchToPortrait = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
    }

    async orientationChangeHandler(dims) {
        const { width, height } = dims.window;
        const isLandscape = width > height;
        this.setState({ isPortrait: !isLandscape });
        // this.props.navigation.setParams({ tabBarHidden: isLandscape });
        // await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.ALL);
    }


    changeRate(rate) {
        this.playbackInstance.setStatusAsync({
            rate,
            shouldCorrectPitch: true,
        });
    }

    render() {
        const win = Dimensions.get('window');
        let body = (
            <Image
                source={require('../../assets/icons/VideoHolder.png')}
                style={{
                    alignSelf: 'stretch',
                    width: win.width,
                    height: win.width / 2,
                }}
            />
        );
        if (this.state.videoStarted) {
            body = (
                <VideoPlayer
                    videoProps={{
                        shouldPlay: this.state.shouldPlay,
                        resizeMode: Video.RESIZE_MODE_CONTAIN,
                        isMuted: false,
                        style: {
                            alignSelf: 'stretch',
                            width: win.width,
                            height: (win.width / 2),
                        },
                        ref: (component) => {
                            this.playbackInstance = component;
                        },
                    }}
                    currentRoute={this.props.appStore.currentRoute}
                    showControlsOnLoad
                    isPortrait={this.state.isPortrait}
                    switchToLandscape={this.switchToLandscape}
                    switchToPortrait={this.switchToPortrait}
                    playFromPositionMillis={0}
                />
            );
        }
        return (
            <TouchableOpacity onPress={() => {
                if (!this.state.videoStarted) {
                    this.setState({ videoStarted: true, shouldPlay: true });
                }
            }}
            >
                {body}
            </TouchableOpacity>
        );
    }
}

export default G2GVideo;
