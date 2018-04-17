import React, { Component} from 'react'


export default class PhotoFetch extends Component {
state = {
  photoInfo: null
}
render() {

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
  const {photoInfo} = this.state
  return (
    <div>
      {photoInfo ?
       // <img key={i} alt={p.source.name} src={`${p.prefix} + ${p.height} + x + ${p.width} + ${p.suffix}`} />
        console.log(`${photoInfo.prefix}${photoInfo.height}x${photoInfo.width}${photoInfo.suffix}`) : null}
    </div>
  )
}

}
