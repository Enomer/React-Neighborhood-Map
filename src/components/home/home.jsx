import React, { Component } from 'react'
const { compose, withStateHandlers } = require("recompose");
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
  client_secret:"V1CLAGXDQEVMLMQZWCOUW5ROBT2C0SOXHPO2EBRSAUHEHVEH&ll=44.3,37.2",
  v:20180323,
  ...params
})



const MapWithAMakredInfoWindow = compose(
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
    <div>
      {window.navigator.geolocation.getCurrentPosition(position => {
        const {latitude,longitude} = position.coords
        const myRequest = fourSquareRequest({
          ll:latitude+','+longitude
        })
        fetch(myRequest).then(response => {
          if(response.ok){
            response.json().then(data => {
              this.googleMap && this.googleMap.panTo({lat:latitude,lng:longitude})

              return (
                <GoogleMap
                  defaultZoom={16}
                  defaultCenter={{ lat: 34.146299, lng: -118.255005 }}
                  ref={ref => this.googleMap = ref}
                  {...props}
                  >
                    {data.response.venues.filter( place => data.response.venues.indexOf(place) < 5 ).map( (nearbyPlace, i) =>
                      <Marker
                        key={i}
                        position={{ lat : nearbyPlace.location.lat, lng: nearbyPlace.location.lng}}
                        onClick={props.onToggleOpen}
                        >
                          {props.isOpen &&
                            <InfoWindow onCloseClick={props.onToggleOpen}>
                              <div> gucci </div>
                            </InfoWindow>}
                          </Marker>
                        )}
                      </GoogleMap>
                    )
                  })
                }
              })
            })
          }
        </div>
      )
    }
  )



  class Home extends Component {

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
