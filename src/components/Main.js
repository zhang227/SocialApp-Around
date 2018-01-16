import React from 'react'
import {Login} from './Login'
import { WrappedRegister } from './Register';

export class Main extends React.Component {
    render() {
        return (
            <section className="main">
                <Login/>
            </section>
        );
    }
}
