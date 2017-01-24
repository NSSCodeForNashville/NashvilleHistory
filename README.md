# NashvilleHistory
A mobile app for exploring Nashville's rich historical markers and public art pieces from [Data.Nashville.gov](https://data.nashville.gov/).

## Technologies
* Ionic v1
* Angular v1
* Google Maps API
* Cordova
* Firebase

## Development

### Installation
You will need to have the following dependencies installed:
* [NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
* [Bower](https://bower.io/#install-bower)
* [Ionic v1](https://ionicframework.com/docs/v2/getting-started/installation/)

From the terminal command line in your `/NashvilleHistory` folder, run the following commands:

```sh
npm install
bower install
```

Move the `node_modules` folder that was just created into the `NashvilleHistory/www/lib/` directory.

Create a file `KeyGetter.js` in the `NashvilleHistory/www/js/factories/` directory with the following code:

```
"use strict";

app.constant("KeyGetter",{
  apiKey: "{{your Firebase API key}}",
  authDomain: "{{your Firebase Auth Domain}}",
  databaseURL: "{{your Firebase Database URL}}",
  storageBucket: "{{your Firebase Storage Bucket}}",
  googleMapsKey: "{{your Google Maps API Key}}",
  historicMarkersKey: "{{your Data.Nashville.Gov API key}}"
})
```

Add a CORS extension like [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) to your Chrome browser. In the Settings, check `Enable cross-origin resource sharing` and updated the `Intercepted URLs or URL patterns` to intercept only `https://maps.googleapis.com/*`. Please remove the default pattern of `*://*/*` from the `Intercepted URLs` list if you haven't already.

When all dependencies are installed, from the terminal command line in your `/NashvilleHistory` folder, run `ionic serve`

### Contribution
Please review and comment on active Issues, and of course submit Issues of your own.

To contribute code:
1. Assign yourself to any open Issue 
1. Create a new branch off `master` with the naming convention: Issue#-description. For instance, `51-menu-routing
1. Plan, ask questions, experiment, code
1. Code must be well-documented, any copypasta from the internet must include a link to the source
1. Make sure you are up-to-date on any comments or conversation regarding your Issue
1. When you have satisfied the Issue, you are ready to submit a Pull Request

To submit a Pull Request:
1. In your terminal, from the root directory of the project: `git pull origin master`
1. Fix any merge conflicts
1. If you are unclear on any particular conflict, ask another contributor for help
1. Commit your changes and push to GitHub
1. On GitHub, open a Pull Request
1. Fill out every field of the Pull Request template. Cross out any fields that aren't applicable
1. Wait for at least one peer review (feel free to ask someone for review)
1. Address any comments of requests for changes
1. Once at least one peer has reviewed and approved your PR, merge it!

To review a Pull Request:
1. In your terminal, from the root directory of the project: `git fetch`
1. Perform a `git checkout` for the branch that you are reviewing
1. Follow the installation procedures above to host the app on your machine
1. Follow the testing procedures laid forth in the PR to confirm functionality
1. In GitHub, from the `Files Changed` tab of the PR, review every line of code added and removed
    * All new code should be well-documented
    * If you are unclear on any changes, please confirm with the PR's owner
    * Add comments, including positive reinforcement and constructive criticism
    * Complete your review by selecting either "Approve" or "Request changes" in the "Submit your review" modal