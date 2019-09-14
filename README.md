This is the G2G Mobile App.

This application is completely ran in Expo, which means all of the code is React-Native, and no actual Native code. 

To start, you will need to download Expo. 

Expo routinely updates and deprecates its versions, so constantly check here

https://docs.expo.io/versions/v30.0.0/workflow/upgrading-expo-sdk-walkthrough


For local development, You will need to download and run the GreenToGo Web application, and you will need to use 'ngrok'.

* Auto ngrok setup
Simply run `npm run ngrok` and wait for the program to say `Ngrok Ready`

* Custom ngrok setup
`ngrok http 8000` to start ngrok
then, get the ngrok http address, and replace `baseUrl` in ./apiClient.js with the ngrok address.


For Android Push Notifications, this project uses FCM (Firebase cloud messaging)

Remember, when deploying to IOS, make sure Advertising Identifier (IDFA) is checked as 'YES' and check the following checkboxes:
* Attribute this app installation to a previously served advertisement
* Attribute an action taken within this app to a previously served advertisement