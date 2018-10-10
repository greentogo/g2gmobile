This is the G2G Mobile App.

This application is completely ran in Expo, which means all of the code is React-Native, and no actual Native code. 

To start, you will need to download Expo. 

Expo routinely updates and deprecates its versions, so constantly check here

https://docs.expo.io/versions/v30.0.0/workflow/upgrading-expo-sdk-walkthrough


For local development, You will need to download and run the GreenToGo Web application, and you will need to use 'ngrok'.

`ngrok http 8000` to start ngrok
then, get the ngrok http address, and replace `url` in ./apiClient.js with the ngrok address.