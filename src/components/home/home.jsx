import React, { Component } from 'react'
// import {Link} from 'react-router-dom'




function createMapLink(url) {
  let queryTag = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.onerror = function () {
    document.write("Google Maps can't be loaded");
  };
  queryTag.parentNode.insertBefore(script, queryTag);
}




class Home extends Component {
  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
  }


  state = {
    map: {}
  }


  componentDidMount() {
    window.initMap = this.initMap;
    createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEXexX7QwrK14aGMnirWoG8sdJe2p8Ds&libraries=places&callback=initMap');
  }


  initMap() {
    let self = this;
    const  map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.069208, lng: -118.402982 },
      zoom:18
    });
    const infoWindow = new window.google.maps.InfoWindow({maxWidth: 300});
    this.setState({
      map: map
    });
    
    window.google.maps.event.addDomListener(window, "resize", function () {
      let mapCenter = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(mapCenter);
    });
  }


  render() {
    return (
      <main id="map-container">
        <div id="map" role="application">
        </div>
      </main>
    )
  }

}

export default Home
