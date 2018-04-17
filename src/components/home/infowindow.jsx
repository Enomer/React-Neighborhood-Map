import React, { Component} from 'react'
const {
  Marker,
  InfoWindow,
} = require("react-google-maps");


export default class GoogleMarker extends Component {

  state = {
    isOpen: false,
  }

  onToggleOpen = ()  => this.setState({
    isOpen: !this.state.isOpen
  })

  render() {
    const { markerLat, markerLng} = this.props
    const { isOpen } = this.state
    return (

      <Marker
          // icon={{
          //   // url: "http://www.clker.com/cliparts/g/9/4/c/Y/0/orange-map-pin.svg"
          //   // anchor: iconAnchor
          // }}
        position={{ lat: markerLat, lng: markerLng }}
        onClick={() => this.setState({isOpen: !isOpen})}
        >
          {isOpen &&
            <InfoWindow onCloseClick={this.onToggleOpen}>
              <div> {this.props.placeName} </div>
            </InfoWindow>
          }
        </Marker>

      )
    }
  }
