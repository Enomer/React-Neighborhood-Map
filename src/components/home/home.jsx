import React, { Component } from 'react'
import {fetchApi} from '../fetch/fetch'
const { compose, withStateHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");


function callback(err, data) {
    if (err) return
    console.log(data)
}

let myRequest = new Request("https://api.foursquare.com/v2/venues/search?client_id=AOYEUOFSLDFJI2A0IRVLHJA0SS0TNS3W1P4AO5USMDJ4AVH2&client_secret=V1CLAGXDQEVMLMQZWCOUW5ROBT2C0SOXHPO2EBRSAUHEHVEH&ll=44.3,37.2&near=Chicago,%20IL&v=20180323")

fetch(myRequest).then(response => {
        if(response.ok){
            response.json().then(data => {
                callback(null,data)
            })
        } else {
            callback(new Error("Response not OK"))
        }
    }).catch(error => {
        console.log(error)
        callback(error)
    })


const MapWithAMakredInfoWindow = compose(
  withStateHandlers(() => ({
    isOpen: false,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={16}
    defaultCenter={{ lat: 34.146299, lng: -118.255005 }}
    >
      <Marker
        position={{ lat: 34.145950, lng: -118.255216 }}
        onClick={props.onToggleOpen}
        > 
          {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
            <div> gucci </div>
          </InfoWindow>}
        </Marker>
      </GoogleMap>
    );


    class Home extends Component {

      state = {
        map: {}
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
