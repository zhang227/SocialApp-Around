import React from 'react'
import {Login} from './Login'
import { Switch, Route } from 'react-router'
import { WrappedRegister } from './Register';

export class Main extends React.Component {
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/Register" component={WrappedRegister}/>
                    <Route path="/Login" component={Login}/>
                    <Route component={Login}/>
                </Switch>
            </div>
        );
    }
}
