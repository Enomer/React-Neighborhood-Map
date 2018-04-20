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


  componentWillReceiveProps(nextProps) {
   // console.log(nextProps.index,this.props.activeIndex,"*******I&^%*&%^%*&%^&%")
   if (nextProps.activeIndex !== this.props.activeIndex) {
    // console.log('first if ')
    if (nextProps.activeIndex === this.props.index) {
     console.log('second if')
     console.log("**********************************")
          console.log("**********************************")
               console.log("**********************************")
                    console.log("**********************************")
                         console.log("**********************************")
                              console.log("**********************************")
                                   console.log("**********************************")
                                        console.log("**********************************")
                                             console.log("**********************************")
                                                  console.log("**********************************")
                                                  console.log('*CONGRATULATIONS')

                                                       console.log("**********************************")
                                                            console.log("**********************************")
                                                                 console.log("**********************************")
                                                                      console.log("**********************************")
                                                                           console.log("**********************************")
                                                                                console.log("**********************************")
                                                                                     console.log("**********************************")
                                                                                          console.log("**********************************")
                                                                                               console.log("**********************************")
     this.onToggleOpen()
    }
   }
  }

  onToggleOpen = ()  => {         // manages whether infowindow is open and makes a fetch call for details of this particular venue and stores info in state
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
        }
      )
    })
  }
  this.setState({
    isOpen: !this.state.isOpen   // i dont know how i can make this info window of the marker corresponding to the side pane name open when that particular side pane name is clicked
  })
}

render() {
  const { markerLat, markerLng} = this.props
  const { isOpen, photoInfo, locationType } = this.state
  return (

    <Marker
      position={{ lat: markerLat, lng: markerLng }}
      defaultAnimation={google.maps.Animation.DROP}   // i have no clue how to animate bounce on click with react google maps couldnt find an answer anywhere
      onClick={this.onToggleOpen}
      icon={{
        url:"http://www.myiconfinder.com/uploads/iconsets/48-48-7a195b78d9607a48fb234f98634fa5ea-pin.png"
      }}
      >
        {isOpen &&
          <InfoWindow
            onCloseClick={() => this.setState({isOpen: !isOpen})}
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
                      alt={photoInfo.source.name}    // type of category listed in inventory window
                      src={`${photoInfo.prefix}${photoInfo.height}x${photoInfo.width}${photoInfo.suffix}`}   // renders photo stored in state when fetch call is made for it
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
