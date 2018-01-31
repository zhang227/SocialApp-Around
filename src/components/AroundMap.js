import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { POS_KEY } from '../constants';
import { AroundMarker } from './AroundMarker';

class AroundMap extends React.Component {
    //change 中心之后重新拿到新的marks
    reloadMarkers = () => {
        const center = this.map.getCenter();
        const position = { lat: center.lat(), lon: center.lng() };
        this.props.loadNearbyPosts(position, this.getRange());
    }

    //center到rate的distance 找个半径 画个圈画出显示的range
    //google api
    getRange = () => {
        const google = window.google;
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new google.maps.LatLng(center.lat(), ne.lng());
            return 0.000621371192 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    getMapRef = (map) => {
        //拿到我移动地图之后的instance
        this.map = map;
        window.thismap = map;
    }

    render() {
        const pos = JSON.parse(localStorage.getItem(POS_KEY)); //从local storage里面拿位置 Jason string to object
        return (
            <GoogleMap
                onDragEnd={this.reloadMarkers} //当我 drag map结束， 就重新刷新marker
                onZoomChanged={this.reloadMarkers} //zoom之后reload
                ref={this.getMapRef}
                defaultZoom={11}
                defaultCenter={{ lat: pos.lat, lng: pos.lon }} //中心到用户当前位置
                defaultOptions={{ scaleControl: true }}
            >
                //这里拿到 在home里的传来的posts
                //将post map到 marker 多少个post就会生成多少个marker
                //将数据map到UI
                {this.props.posts ? this.props.posts.map((post, index) =>
                    <AroundMarker
                        key={`${index}-${post.user}-${post.url}`} //生成一个unique key  每个map都要有唯一Key
                        post={post}/>) : null}
            </GoogleMap>
        );
    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));