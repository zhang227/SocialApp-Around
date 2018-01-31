import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

export class AroundMarker extends React.Component {

    //为了让每一个marker自己有一个state 如果鼠标移动上去 就出来信息
    //所以建立一个marker自己的component
    state = {
        isOpen: false,
    }

    onToggleOpen = () => {
        this.setState((prevState) => {
            return { isOpen: !prevState.isOpen };
        });
    }
    //图片下面显示用户信息
    render() {
        const { location, url, message, user } = this.props.post; //存在一起简化code
        return (
            <Marker
                position={{lat: location.lat, lng: location.lon}}
                onMouseOver={this.onToggleOpen}
                onMouseOut={this.onToggleOpen}
            >
                {this.state.isOpen ?
                    <InfoWindow onCloseClick={this.onToggleOpen}>
                        <div>
                            <img className="around-marker-image" src={url} alt={`${user}: ${message}`}/>
                            <p>{`${user}: ${message}`}</p>
                        </div>
                    </InfoWindow> : null}
            </Marker>
        );
    }
}

