# webmessenger-launcher-displaying

This contains examples on how to only show the WebMessenger Launcher based on items such as time of day and country the user is browsing in.

While the WebMessenger [Launcher](https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/launcherPlugin) is designed to be shown all the time and use of a conversation BOT is recommended for this like after hours responses. Some users want the ability to either "show" or "hide" the launcher based on these items. While there is an official documented example that can be found on how to create your own launcher [here](https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/pluginExamples#build-your-own-messenger-launcher) this example is more around using the existing launcher but you controlling the displaying of it or not.

![](/docs/images/launcher.png?raw=true)

## Repo layout

In this repo you will find at the time of writing this readMe 2x folders with use cases in them

```
country
date-time
```

inside each of these folders are both the `.js` and `.min.js` file for hosting. While you can host the .js file using a min version is recommended. As these are taking config from the main page there will be global variables you will also need to configure for the configuration that is then used inside these files. Now you typically would not use both of these at the same time, these are examples and more hopefully giving the ability to show what types of things are possible so understanding them is more the key here then the raw working code.

As we are only `showing` the launcher based on the codes logic ensure that your WebMessenger configuration is set to "Hide until triggered by business logic"

![](/docs/images/settings.png?raw=true)

to build your own `.min.js` versions of the code if you make changes I recommend using [terser](https://terser.org/) but there are many tools out there that you may prefer.

## Country use case

To use this example below the normal WebMessenger Deployment snippet of code add the below two lines for the settings you want to pass as well as the location of the `genesysCountryCheck.min.js`. Ensure that you replace the identifiers:

- WEBMESSENGER_DEPLOYMENTID = Your WebMessenger deployment Id from your environment.
- REGION = The [region] your Genesys Cloud ORG is in eg: `mypurecloud.com.au`
- SOURCE_COUNTRY = The customers location that you want to `allow` or `show` the launcher. In my case I set this to `Australia`

### NOTE:

If you require a LIST of countries you can change the code to accept an `Array` and then simply list the allowed countries rather then just one. The Country formatting is what is received from Genesys Predictive Engagement So ensure that this is enabled:

![](/docs/images/apps.png?raw=true)

Genesys Predictive Engagement also does have usage and cost against it based on sessions please ensure you understand this details on pricing can be found [here](https://help.mypurecloud.com/articles/predictive-engagement-event-pricing/)

```
<script> const gc_deploymentId = 'WEBMESSENGER_DEPLOYMENTID'; const gc_region = 'REGION'; const gc_country = 'SOURCE_COUNTRY';</script>
<script src="./genesysCountryCheck.min.js"></script>
```

To minimize the number of API requests to check the users browsing location this only happens at the start of each browser "session" and is cached in the `sessionStorage`. This then not only improves speed but as Genesys Predictive Engagement is bill based on `events` it will also reduce the cost massively especially if your not running a Single Page Application design on your website.

## Date-time use case

For this use case I am using a publicly available API [WorldTimeAPI](https://worldtimeapi.org/) you can use a different API if you wish, remember to comply with this 3rd parties terms of use as well as there is an option to donate to their service if you like as well.

To use this example below the normal WebMessenger Deployment snippet of code add the below two lines for the settings you want to pass as well as the location of the `genesysTimeCheck.min.js`. Ensure that you replace the identifiers:

- gc_location = This is the location that you want to operate out of, in my example I have used `Australia/Melbourne` for information on this APIs formatting for other locations please see their documentation [here](https://worldtimeapi.org/pages/examples).
- gc_days = An array to list the days you want to be open in my example i have done Monday through to Friday (Weekdays) `[1,2,3,4,5]` The format is where Sunday = 0.
- gc_open = The opening time in the timezone you have selected from the above location in my example `09:00:00` for a 9am start.
- gc_closed = The closing time in the timezone you have selected from the above location in my example `17:30:00` for a 5:30pm close

```
<script> const gc_location = 'Australia/Melbourne'; const gc_days = [1,2,3,4,5]; const gc_open = '09:00:00'; const gc_closed = '17:30:00';</script>
<script src="./genesysTimeCheck.min.js"></script>
```

To minimize the number of API requests to check the time details I am caching details in the `sessionStorage` and including a `ttl` value, This then only re-checks every 5min. You can configure this timer inside the code if you like but i would not make it to low as doing additional API requests on every page load will slow down page loading as well as put additional load on the time API your using.
