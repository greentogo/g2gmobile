import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import {
    Text,
} from 'native-base';
import styles from '../../styles';
import axios from '../../apiClient';

@inject('appStore')
@observer
class CommunityBoxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.appStore.user,
            totalBoxesReturned: false,
            totalUserBoxesReturned: false,
            color: styles.primaryColor,
            background: styles.primaryCream,
        };
    }

    componentDidMount() {
        const color = this.props.color || styles.primaryColor;
        const background = this.props.background || styles.primaryCream;
        axios.get(`/stats/${this.props.appStore.user.username}/`, {
            headers: {
                Authorization: `Token ${this.props.appStore.authToken}`,
            },
        }).then((response) => {
            if (response.data && response.data.data) {
                let userBoxes = false;
                if (response.data.data.total_user_boxes_returned && response.data.data.total_user_boxes_returned > 0) {
                    userBoxes = response.data.data.total_user_boxes_returned;
                }
                this.setState({
                    totalUserBoxesReturned: userBoxes, totalBoxesReturned: response.data.data.total_boxes_returned, color, background,
                });
            }
        }).catch((error) => {
            axios.post('/log/', {
                context: 'CommunityBoxes.js', error, message: error.message, stack: error.stack,
            });
            if ((error.status && error.status === 401) || (error.response && error.response.status && error.response.status === 401)) {
                this.props.appStore.clearAuthToken();
            }
        });
    }

    render() {
        return (
            <View>
                {this.state.totalBoxesReturned && (
                    <View style={{ backgroundColor: this.state.background, ...styles.communityBoxesView }}>
                        <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                            Our community
                        </Text>
                        <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                            has saved
                        </Text>
                        <View style={styles.centeredRowNoPadding}>
                            <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                                {this.state.totalBoxesReturned}
                            </Text>
                            <Image
                                source={require('../../assets/icons/GTG-Box-App.png')}
                                style={styles.communityBoxesBoxImg}
                            />
                            <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                                s
                            </Text>
                        </View>
                        <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                            from a landfill
                        </Text>
                    </View>
                )
                }
                {this.state.totalUserBoxesReturned && (
                    <View style={{ backgroundColor: this.state.background, ...styles.communityBoxesView }}>
                        <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                            You've saved
                        </Text>
                        <View style={styles.centeredRowNoPadding}>
                            <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                                {this.state.totalUserBoxesReturned}
                            </Text>
                            <Image
                                source={require('../../assets/icons/GTG-Box-App.png')}
                                style={styles.communityBoxesBoxImg}
                            />
                            <Text style={{ color: this.state.color, ...styles.communityBoxesText }}>
                                s
                            </Text>
                        </View>
                    </View>
                )
                }
            </View>
        );
    }
}

export default CommunityBoxes;
