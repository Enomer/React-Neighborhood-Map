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
        position={{ lat: markerLat, lng: markerLng }}
        onClick={() => this.setState({isOpen: !isOpen})}
        >
          {isOpen &&
            <InfoWindow onCloseClick={this.onToggleOpen}>
              <div> gucci </div>
            </InfoWindow>
          }
        </Marker>

      )
    }
  }
