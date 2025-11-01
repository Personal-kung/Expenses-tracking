# Personal app
This was first developed in Expo Snack and tested in device using Expo Go.
## Step-by-Step for creating Standalone APK
1. Download ZIP file from Expo Snack
2. (If working from github codespace) Upload and uzip
3. `cd` into the folder where the APP.json and package.json are located
4. Run the following command `npm install expo` after installation run `npx expo --version` the obtained version should be the same as the one in the package.json
5. (optional) *Both the server and client device MUST be in the same network* run `npx expo start`. This will generate a QR code and web url that will allow to run the app. After finishing testing, kill the server using `CTRL+C`
6. Run `npm install -g eas-cli` to create an Expo Project that will help with creating the standalon app
7. *An Expo account is needed* Run `eas login` for logging into the Expo account. It will ask for email and password.
8. Run `npx eas build:configure` 


## Expenses tracking

## Logging

