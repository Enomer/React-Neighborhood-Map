import React, { Component } from 'react'
import GoogleMarker from './infowindow'
import escapeRegExp from 'escape-string-regexp';
const { compose } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const fancyMapStyles = require("./fancyMapStyles.json");

const callback = (err, data) => {
  // if (data) return
  // console.log(`Venues Near You: ${data.response.venues.map(venue => `${venue.name}\n`).splice(0,8)}`)
  if (err) return
  console.log(`error occured: ${err}`)
}
const formatQueryString = objectofStuff =>  Object.keys(objectofStuff).map(key => key + '=' + objectofStuff[key]).join('&')
const fourSquareRequest = (type, params) => "https://api.foursquare.com/v2/venues/" + type + "?" + formatQueryString({
  client_id:"AOYEUOFSLDFJI2A0IRVLHJA0SS0TNS3W1P4AO5USMDJ4AVH2",
  client_secret:"WETOABHTGSZHAJJOXQIJPDEQ52ETJLLMJVJOE4JZVHSEWHDZ",
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
      defaultOptions={{ styles: fancyMapStyles }}
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
        { props.placesInfo ?
          props.placesInfo
          .map( (v,i) =>
          <GoogleMarker
            key={i}
            placeName = { v[0] }
            markerLat={ v[1] }
            markerLng={ v[2] }
            fourSquareRequest={ fourSquareRequest }
            v={ v }
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
    inputChar: '',
    venueInfo: null,
    photoInfo: null
  }



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
          ll:latitude+','+longitude,
          venuePhotos:1,
          venuephotos:"1"
        })
        fetch(myRequest).then(response => {
          if(response.ok){
            response.json().then(data => {
              this.setState({
                venues: data.response.venues.splice(0,8),
                venueInfo: data.response.venues.splice(0,8).map(ven => [ven.name, ven.location.lat, ven.location.lng, ven.id]),
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
  const {venues, mylat, mylng, inputChar, venueInfo} = this.state
  let placesInfo = null;
    if (venueInfo) {
      placesInfo = venueInfo
    }

    if (inputChar)  {
      const match = new RegExp(escapeRegExp(inputChar), 'i')
      placesInfo = venueInfo.filter(
        (place) => match.test(place[0])
      )
    } else {
      placesInfo = venueInfo
    }
  return (
    <main>
      <section className="grid-x">
        <div style={{padding: '25px'}} id="sidePane" className="align-center cell large-3 medium-4 small-4">
          <h2 style={{textAlign: 'center', color: '#1f8a70'}}>Locations Near You</h2>
          <input
            type="text"
            placeholder="Search Place"
            value={inputChar}
            onChange={(event) => {
              this.inputDetect(event.target.value)}}
            />

        <ul>
          {
            venueInfo ?
            placesInfo.map( (v,i) => {
                return (
                  <li key={i} >
                      <hr></hr>
                    <p id="placesInfo">{placesInfo.map(v => v[0])[i]}</p>
                  </li>
                )
              }
            )
            :
            null
          }
        </ul>
        </div>
      </section>
      <MapWithAMakredInfoWindow
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEXexX7QwrK14aGMnirWoG8sdJe2p8Ds"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        venues={venues}
        mylat={mylat}
        mylng={mylng}
        placesInfo = {placesInfo}
      />
    </main>
    )
  }
}


export default Home
