import React, { Component } from 'react'
const {
  Marker,
  InfoWindow,
} = require("react-google-maps");

/*global google*/

export default class GoogleMarker extends Component {

  state = {
    isOpen: false,
    photoInfo: null,
    locationType: null
  }

  onToggleOpen = ()  => {
if (!this.state.photoInfo) {
 fetch(
   this.props.fourSquareRequest( `${this.props.v[3]}`  , {
     limit: 2
   })
 ).then(response => {
     response.json().then(data => {
       this.setState({
         photoInfo: data.response.venue.photos.groups.length ? data.response.venue.photos.groups[0].items[0] : null,
         locationType: data.response.venue.categories[0] ? data.response.venue.categories[0].name : null
       })
       console.log(data.response.venue.categories[0] ? console.log('yes') : console.log('no'))
     }
   )
})
}

this.setState({
  isOpen: !this.state.isOpen
})
}

  render() {
    const { markerLat, markerLng} = this.props
    const { isOpen, photoInfo, locationType } = this.state
    return (

      <Marker
        position={{ lat: markerLat, lng: markerLng }}
        defaultAnimation={google.maps.Animation.DROP}
        onClick={this.onToggleOpen}
        icon={{
        url:"http://www.myiconfinder.com/uploads/iconsets/48-48-7a195b78d9607a48fb234f98634fa5ea-pin.png"
        }}
        >
          {isOpen &&
            <InfoWindow
                onCloseClick={() => this.setState({isOpen: !isOpen})}
                style={{background: 'orange', color: 'orange' }}
              >
              <div
                className="grid-x align-middle align-center text-center"
                style={{maxWidth: '250px'}}
                >
              <h5 className="cell">
                {this.props.placeName}
              </h5>
                {
                  locationType ?
                  <h6 className="cell">{locationType}</h6>
                  :
                  null
                }
                {
                  photoInfo ?
                 <img
                   className="cell"
                   alt={photoInfo.source.name}
                   src={`${photoInfo.prefix}${photoInfo.height}x${photoInfo.width}${photoInfo.suffix}`}
                   style={{maxHeight:'200px', maxWidth:'200px'}}
                 />
                 :
                 null
               }
              </div>
            </InfoWindow>
          }
        </Marker>

      )
    }
  }
