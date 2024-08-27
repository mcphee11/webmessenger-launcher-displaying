'use strict'
Genesys('subscribe', 'Launcher.ready', function () {
  const dateTimeNow = new Date()
  const plus5min = new Date()
  if (sessionStorage.getItem('gc_ttl')) {
    const ttl = new Date(sessionStorage.getItem('gc_ttl'))
    plus5min.setTime(ttl.getTime() + 300000)
    if (dateTimeNow < plus5min && sessionStorage.getItem('gc_state') == 'open') {
      Genesys('command', 'Launcher.show')
      return
    }
    if (dateTimeNow < plus5min && sessionStorage.getItem('gc_state') == 'closed') {
      //do nothing
    } else {
      console.log('renewing ttl')
      checkTime()
    }
  } else {
    checkTime()
  }
})

async function checkTime() {
  console.log('checking times')
  console.log(gc_location)

  let time = await fetch(`https://worldtimeapi.org/api/timezone/${gc_location}`)
  let response = await time.json()
  console.log(response)

  let localNow = new Date(response.datetime)
  let hourMin = response.datetime.substring(11, 15)

  console.log(`localNow: ${localNow}`)
  sessionStorage.setItem('gc_ttl', localNow)

  if (gc_open < hourMin && gc_closed > hourMin && gc_days.includes(response.day_of_week)) {
    Genesys('command', 'Launcher.show')
    sessionStorage.setItem('gc_state', 'open')
  } else {
    sessionStorage.setItem('gc_state', 'closed')
  }
}
