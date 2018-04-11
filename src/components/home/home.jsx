import React, { Component } from 'react'
const { compose, withStateHandlers} = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");


const callback = (err, data) => {
  if (err) return
  console.log(`Venues Near You: ${data.response.venues.map(venue => `${venue.name}\n`).splice(0,5)}`)
}
const formatQueryString = objectofStuff =>  Object.keys(objectofStuff).map(key => key + '=' + objectofStuff[key]).join('&')
const fourSquareRequest = params => "https://api.foursquare.com/v2/venues/search?" + formatQueryString({
  client_id:"AOYEUOFSLDFJI2A0IRVLHJA0SS0TNS3W1P4AO5USMDJ4AVH2",
  client_secret:"V1CLAGXDQEVMLMQZWCOUW5ROBT2C0SOXHPO2EBRSAUHEHVEH",
  v:20180323,
  ...params
})



const MapWithAMakredInfoWindow = compose(
  withStateHandlers(() => ({
    isOpen: false
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
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
          .splice(0,5)
          .map( (v,i) =>
          <Marker
            key={i}
            position={{ lat: v.location.lat, lng: v.location.lng }}
            onClick={props.onToggleOpen}
            >
              {props.isOpen &&
                <InfoWindow onCloseClick={props.onToggleOpen}>
                  <div> gucci </div>
                </InfoWindow>
              }
            </Marker>
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
      mylng: null
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
            const myRequest = fourSquareRequest({
              ll:latitude+','+longitude
            })
            fetch(myRequest).then(response => {
              if(response.ok){
                response.json().then(data => {
                  this.setState({
                    venues: data.response.venues
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
        <MapWithAMakredInfoWindow
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEXexX7QwrK14aGMnirWoG8sdJe2p8Ds"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          venues={venues}
          mylat={mylat}
          mylng={mylng}
        />
      )
    }

  }

  export default Home
