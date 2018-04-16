import React, { Component } from 'react'
import GoogleMarker from './infowindow'
import escapeRegExp from 'escape-string-regexp';
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
    placeId: null,
    venueName: null,
    inputChar: '',
  }

//   fetchPhoto = () => {
//     if (this.state.placeId) {
//       fetch(
//         fourSquareRequest( `${this.state.placeId[4]}/photos`  , {
//           limit: 2
//         })
//       ).then(response => {
//         // console.log(response)
//           response.json().then(data => {
//             console.log(data)
//           }
//         )
//     })
//   }
// }

inputDetect = (query) => {
        this.setState({ inputChar: query })
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
              console.log(data.response.venues)
              this.setState({
                venues: data.response.venues,
                placeId: data.response.venues.splice(0,8).map((ven) => ven.id),
                venueName: data.response.venues.splice(0,8).map((ven) => ven.name),
              })

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
        maximumAge: 60000
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
  const {venues, mylat, mylng, inputChar, venueName} = this.state
  let placesShown = venueName;
    if (inputChar)  {
      const match = new RegExp(escapeRegExp(inputChar), 'i')
      placesShown = venueName.filter(
        (place) => match.test(place)
      )
    } else {
      placesShown = venueName
    }
  return (
    <main>
      <section id="sidePane">
        {/* {setTimeout(() => this.fetchPhoto(), 5000)} */}
        <h2 style={{display: 'flex', textAlign: 'center'}}>Locations Near You</h2>
          <input
            style={{display: 'flex', margin: 'auto'}}
            type="text"
            placeholder="Search Place"
            value={inputChar}
            onChange={(event) => {
              this.inputDetect(event.target.value)}
            }
          />
        <ul>
          {/* {console.log(venueName)} */}
          {placesShown ?
            placesShown.map( (v,i) =>
              <li key={i} >
                  <hr></hr>
                <p>{placesShown[i]}</p>
              </li>
            )
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
