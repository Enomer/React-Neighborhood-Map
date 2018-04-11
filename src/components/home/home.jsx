import React, { Component } from 'react'
const { compose, withStateHandlers, withProps} = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");


const callback = (err, data) => {
  if (err) return
  console.log(data)
}
const formatQueryString = objectofStuff =>  Object.keys(objectofStuff).map(key => key + '=' + objectofStuff[key]).join('&')
const fourSquareRequest = params => "https://api.foursquare.com/v2/venues/search?" + formatQueryString({
  client_id:"AOYEUOFSLDFJI2A0IRVLHJA0SS0TNS3W1P4AO5USMDJ4AVH2",
  client_secret:"V1CLAGXDQEVMLMQZWCOUW5ROBT2C0SOXHPO2EBRSAUHEHVEH",
  v:20180323,
  ...params
})




const MapWithAMakredInfoWindow = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(() => ({
    isOpen: false,
    hello:() => console.log('hello')
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
        {props.venues ? this.googleMap && this.googleMap.panTo({lat:props.mylat,lng:props.mylng}) : null}
        { props.venues ?
          props.venues
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
          console.log('navigator detected')
          navigator.geolocation.getCurrentPosition(position => {
            const {latitude,longitude} = position.coords
            this.setState({
              mylat:  latitude,
              mylng: longitude
            })
            const myRequest = fourSquareRequest({
              ll:latitude+','+longitude
            })
            console.log('bandos')
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
            console.warn(`ERROR(${err.code}): ${err.message}`)
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
      } else {
        console.log('navigator gielnor')
      }
    }

    componentDidMount() {
      console.log('gucci')
      this.fetchApi()
    }

    render() {
      return (

        <MapWithAMakredInfoWindow
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEXexX7QwrK14aGMnirWoG8sdJe2p8Ds"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          venues={this.state.venues}
          mylat={this.state.mylat}
          mylng={this.state.mylng}
        />
      )
    }

  }

  export default Home
