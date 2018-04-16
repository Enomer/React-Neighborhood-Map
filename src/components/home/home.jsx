import React, { Component } from 'react'
import GoogleMarker from './infowindow'
const { compose } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  // InfoWindow,
} = require("react-google-maps");



const callback = (err, data) => {
  if (err) return
  console.log(`Venues Near You: ${data.response.venues.map(venue => `${venue.name}\n`).splice(0,8)}`)
}
const formatQueryString = objectofStuff =>  Object.keys(objectofStuff).map(key => key + '=' + objectofStuff[key]).join('&')
const fourSquareRequest = (type, params) => "https://api.foursquare.com/v2/venues/" + type + "?" + formatQueryString({
  client_id:"AOYEUOFSLDFJI2A0IRVLHJA0SS0TNS3W1P4AO5USMDJ4AVH2",
  client_secret:"V1CLAGXDQEVMLMQZWCOUW5ROBT2C0SOXHPO2EBRSAUHEHVEH",
  v:20180323,
  ...params
})



const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => {
  return (
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{lat: props.mylat || 34.146299, lng: props.mylng || -118.255005 }}
      ref={ref => this.googleMap = ref}
      {...props}
      >
        <Marker
          position={{lat: 34.146291, lng: -118.255001}}
        />
        {props.venues ? this.googleMap && this.googleMap.panTo({
          lat:props.mylat,
          lng:props.mylng
        }) : null}
        { props.venues ?
          props.venues
          .splice(0,8)
          .map( (v,i) =>
          <GoogleMarker
            key={i}
            markerLat={v.location.lat}
            markerLng={v.location.lng}
            toggleWindow={props.onToggleOpen}
          />
        )
        :
        null
      }

    </GoogleMap>
  )
})

class Home extends Component {

  state = {
    venues: null,
    mylat: null,
    mylng: null,
    placeId: null
  }

  fetchPhoto = () => {
    if (this.state.placeId === true) {
      fetch(
        fourSquareRequest( `${this.state.placeId[4]}/photos`  , {
          limit: 2
        })
      ).then(response => {
        // console.log(response)
          response.json().then(data => {
            console.log(data)
          }
        )
    })
  }
}


fetchApi = () => {
  if (navigator.geolocation) {
    try {
      console.log('Getting Current Location')
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude,longitude} = position.coords
        this.setState({
          mylat:  latitude,
          mylng: longitude
        })
        const myRequest = fourSquareRequest("search", {
          ll:latitude+','+longitude
        })
        fetch(myRequest).then(response => {
          if(response.ok){
            response.json().then(data => {
              // console.log(data)
              this.setState({
                venues: data.response.venues,
                placeId: data.response.venues.splice(0,8).map((ven) => ven.id)
              })
              console.log(this.state.placeId[4])
              callback(null,data)
            })
          } else {
            callback(new Error("Response not OK"))
          }
        }).catch(error => {
          console.log(error)
          callback(error)
        })
      }, err => {
        // window.location.reload()
        console.warn(`ERROR(${err.code}): ${err.message} ... reinitiliazing`)
        return this.fetchApi()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      })
    } catch(error){
      console.log(error)
    }
  }
}


componentDidMount() {
  this.fetchApi()
}

render() {
  const {venues, mylat, mylng} = this.state
  return (
    <main>
      <section id="sidePane">
        {/* {setTimeout(() => this.fetchPhoto(), 5000)} */}
        <h1>Locations Near You</h1>
        <ul>
          {venues ?
            venues.map( (v,i) =>
            //   const photoFetch = fourSquareRequest( `${v.id}/photos`  , {
            //   limit: 2
            // })
            //   return (
            <li key={i}>
              {/* {
                fetch(
                fourSquareRequest( `${v.id}/photos`, {limit: 2})
              ).then(response => {
              if(response.ok){
              response.json().then(data => {
              console.log(data)
            })
          } else {
          callback(new Error("Response not OK"))
        }
      }).catch(error => {
      console.log(error)
      callback(error)
    })

  } */}
</li>
)
// )
:
null}
</ul>
</section>
<MapWithAMakredInfoWindow
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEXexX7QwrK14aGMnirWoG8sdJe2p8Ds"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `100vh` }} />}
  mapElement={<div style={{ height: `100%` }} />}
  venues={venues}
  mylat={mylat}
  mylng={mylng}
/>
</main>
)
}

}

export default Home
