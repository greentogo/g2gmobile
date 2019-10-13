import React from 'react';
import { Image, View } from 'react-native';
import styles from '../../styles';

// PureComponents dont render as often as stateless functions, and are therefore faster
class G2GTitleImage extends React.PureComponent {
    render() {
        return (
            <View style={styles.loadingContainer}>
                <Image
                    source={require('../../assets/icons/g2g-white.png')}
                    style={{ height: 45, width: 144 }}
                />
            </View>
        );
    }
}

export default G2GTitleImage;
