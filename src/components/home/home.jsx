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
    containerElement: <div style={{ height: `400px` }} />,
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
    <main>
      { props.apiFinished
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 34.146299, lng: -118.255005 }}
        ref={ref => this.googleMap = ref}
        {...props}
        >
          {props.
            <Marker
              position={{ lat: 34.145950, lng: -118.255216 }}
              onClick={props.onToggleOpen}
              >
              {props.isOpen &&
                <InfoWindow onCloseClick={props.onToggleOpen}>
                  <div> gucci </div>
              </InfoWindow>}
            </Marker>
          </GoogleMap>
        </main>
      )
    })


    class Home extends Component {

      fetchApi = () => {

        if (navigator.geolocation) {
          try {
            navigator.geolocation.getCurrentPosition(position => {
              const {latitude,longitude} = position.coords
              const myRequest = fourSquareRequest({
                ll:latitude+','+longitude
              })
              fetch(myRequest).then(response => {
                if(response.ok){
                  response.json().then(data => {
                    this.googleMap && this.googleMap.panTo({lat:latitude,lng:longitude})
                    callback(null,data)
                    // console.log(data)
                  })
                } else {
                  callback(new Error("Response not OK"))
                }
              }).catch(error => {
                console.log(error)
                callback(error)
              })
            });
          } catch(error){
            console.log(error)
          }
        }
  }

      componentDidMount() {
      }

      render() {
        return (

          <MapWithAMakredInfoWindow
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEXexX7QwrK14aGMnirWoG8sdJe2p8Ds"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100vh` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        )
      }

    }

    export default Home
