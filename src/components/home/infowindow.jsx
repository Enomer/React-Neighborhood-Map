import React, { Component } from 'react'
const {
  Marker,
  InfoWindow,
} = require("react-google-maps");


export default class GoogleMarker extends Component {

  state = {
    isOpen: false,
    photoInfo: null
  }

  onToggleOpen = ()  => {

  console.log('hello')
if (!this.state.photoInfo) {
 fetch(
   this.props.fourSquareRequest( `${this.props.v[3]}/photos`  , {
     limit: 2
   })
 ).then(response => {
     response.json().then(data => {
       this.setState({
         photoInfo: data.response.photos.items[0]
       })
       console.log(data.response.photos)
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
    const { isOpen, photoInfo } = this.state
    return (

      <Marker
        position={{ lat: markerLat, lng: markerLng }}
        onClick={this.onToggleOpen}
        icon={{
        url:"http://www.myiconfinder.com/uploads/iconsets/48-48-7a195b78d9607a48fb234f98634fa5ea-pin.png"
        }}
        style={{height: '75px', width: '75px'}}
        >
          {isOpen &&
            <InfoWindow
                onCloseClick={() => this.setState({isOpen: !isOpen})}
                style={{background: 'orange', color: 'orange'}}
              >
              <div className="grid-x align-middle align-center text-center">
              <h5 className="cell">
                {this.props.placeName}
              </h5>
                {photoInfo ?
                 <img
                   className="cell"
                   alt={photoInfo.source.name}
                   src={`${photoInfo.prefix}${photoInfo.height}x${photoInfo.width}${photoInfo.suffix}`}
                   style={{maxHeight:'200px', maxWidth:'200px'}}
                 />
                 :
                 null}
              </div>
            </InfoWindow>
          }
        </Marker>

      )
    }
  }
