'use strict'
Genesys('subscribe', 'Launcher.ready', function () {
  if (sessionStorage.getItem('gc_countryName')) {
    if (sessionStorage.getItem('gc_countryName') === `${gc_country}`) {
      Genesys('command', 'Launcher.show')
    } else {
      //do nothing
    }
  } else {
    checkGeoLocation()
  }
})

async function checkGeoLocation() {
  console.log('checking geolocation')
  const date = new Date()
  const less2min = new Date()
  less2min.setTime(date.getTime() - 120000)
  const isoString = less2min.toISOString()

  let body = {
    customerCookieId: '68d3b275-9134-4518-85e6-111111111111',
    eventName: 'getting_location',
    screenName: 'DataCapture',
    createdDate: isoString,
    app: {
      name: 'location_getter',
      namespace: 'com.genesys',
      version: '1.0.1',
      buildNumber: '100',
    },
    device: {
      category: 'other',
      type: 'Other',
      isMobile: false,
      screenHeight: 1170,
      screenWidth: 2532,
      screenDensity: 1,
      fingerprint: '2e8e6dfbc10cac1e22af111111111111',
      osFamily: 'Other',
      osVersion: '1.0.0',
      manufacturer: 'Other',
    },
  }

  let post = await fetch(`https://api.${gc_region}/api/v2/journey/deployments/${gc_deploymentId}/appevents`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  })

  let response = await post.json()
  console.log(response.geolocation)
  sessionStorage.setItem('gc_countryName', response.geolocation.countryName)

  if (response.geolocation.countryName === `${gc_country}`) {
    Genesys('command', 'Launcher.show')
  }
}
