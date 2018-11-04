import { Dimensions } from 'react-native';

const primaryColor = '#628E86';
// const primaryCream = '#F8F8F4';
const primaryCream = '#F9F9E8';
// const primaryCream = 'rgb(248, 248, 244)';
const secondaryColor = '#85A39C';
const lightGrey = '#D3D3D3';

const styles = {
    primaryColor,
    primaryCream,
    lightGrey,
    container: {
        flex: 1,
        backgroundColor: primaryCream,
    },
    popToTopStyle: {
        fontSize: 40,
        color: 'white',
        paddingTop: 5,
        paddingLeft: 5,
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    centeredRowNoPadding: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerStyle: {
        borderWidth: 1,
        borderColor: '#000000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorStyle: {
        color: 'red',
        textAlign: 'center',
    },
    centeredText: {
        paddingTop: 5,
        paddingBottom: 5,
        color: primaryColor,
        fontSize: 16,
        textAlign: 'center',
    },
    boldCenteredText: {
        paddingTop: 5,
        paddingBottom: 5,
        color: primaryColor,
        fontWeight: '800',
        fontSize: 20,
        textAlign: 'center',
    },
    boldWhiteText: {
        paddingTop: 5,
        paddingBottom: 5,
        color: 'white',
        fontWeight: '800',
        fontSize: 20,
        textAlign: 'center',
    },
    bottomFixed: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    loginSignupMargin: {
        marginBottom: 40,
        paddingLeft: '5%',
        paddingRight: '10%',
    },
    loginLabelStyle: {
        color: lightGrey,
    },
    loginBackgroundImage: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'space-around',
    },
    loginButton: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    loginInputStyle: {
        color: 'white',
    },
    loginScreenButtonBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: secondaryColor,
    },
    mapCalloutTitle: {
        flex: 1,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
    },
    mapCalloutText: {
        flex: 1,
        textAlign: 'left',
    },
    mapCalloutDirections: {
        flex: 1,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    subscriptionBanner: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: primaryColor,
        color: primaryCream,
        textAlign: 'center',
        fontSize: 20,
    },
    submissionContainer: {
        flex: 1,
        backgroundColor: primaryCream,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    submissionAddSubIcon: {
        fontSize: 30,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        width: 50,
        alignSelf: 'center',
    },
    submissionBoxCountStyle: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 30,
        alignSelf: 'center',
    },
    submissionSubmitButton: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#5fb75f',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#fff',
    },
    submissionSubmitButtonBlocked: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#808080',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#fff',
    },
    submissionSubmitTextStyle: {
        fontSize: 30,
        color: 'white',
    },
    successTopContainer: {
        backgroundColor: primaryColor,
        flex: 1,
        flexDirection: 'column',
    },
    successText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 45,
    },
    successDateTimeText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
    },
    successImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    successImage: {
        height: 140,
        width: 140,
    },
    communityBoxesText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 26,
    },
    communityBoxesView: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
    },
    communityBoxesBoxImg: {
        height: 35,
        width: 35,
        marginRight: 3,
        marginLeft: 10,
    },
    window: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
};

export default styles;
