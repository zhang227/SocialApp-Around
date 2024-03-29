import React from 'react';
import $ from 'jquery';
import { Tabs, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton'
import { WrappedAroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        posts: [],
        error: '',
        loadingPosts: false,
        loadingGeoLocation: false,
    }
    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({ loadingGeoLocation: true, error: '' });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({ error: 'Your browser does not support geolocation!'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        this.setState({ loadingGeoLocation: false, error: '' }); //成功后重置
        const { latitude: lat, longitude: lon } = position.coords;
        const location = { lat: lat, lon: lon };
        localStorage.setItem(POS_KEY, JSON.stringify(location)); //用local storage 存 geoLocation
        this.loadNearbyPosts(location);
    }

    onFailedLoadGeoLocation = (error) => {
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geo location!'}); //在fail的时候得到你设置的error
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geo location ..."/>;
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading posts ..."/>;
        } else if (this.state.posts) {
            // [1,2,3] ===> f ====> [f(1), f(2), f(3)]
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                };
            });
            return <Gallery images={images}/>
        }
        return null;
    }

    loadNearbyPosts = (location, radius) => {
        //ajax call去load request
        //const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY)); //重新便会object
        const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        this.setState({ loadingPosts: true });
        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            },
        }).then((response) => {
            console.log(response);
            this.setState({ posts: response, loadingPosts: false, error: '' });
        }, (error) => {
            this.setState({ loadingPosts: false, error: error.responseText });
        }).catch((error) => {
            this.setState({ error: error });
        });
    }

    render() {
        //传到后面要用的component,传入createpostButton
        //对应createPostButton
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>
        return (
            <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrappedAroundMap
                        loadNearbyPosts={this.loadNearbyPosts} //传入around map
                        posts={this.state.posts} //将 post传到around map里做mark for each post
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
