import React from 'react';
import { Register } from './Register';
import { Login } from './Login';
import { Home } from './Home';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


export class Main extends React.Component {
    //在这一层props传过来， 根据是否login 选择render 哪一个page
    getLogin = () => {
        //redirect 可以解决inconsistence url 和实际
        return this.props.isLoggedIn ? <Redirect to="/home"/> : <Login handleLogin={this.props.handleLogin}/>
    }

    getHome = () => {
        //如果没有log in 输入home会直接导去login
        return this.props.isLoggedIn ? <Home/> : <Redirect to="/login"/>;
    }

    getRoot = () => {
        //一开始直接redirect去log in
        return <Redirect to="/login"/>;
    }
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route exact path="/" render={this.getRoot}/>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/home" render={this.getHome}/>
                    <Route component={Login}/>
                </Switch>
            </div>
        );
    }
}
