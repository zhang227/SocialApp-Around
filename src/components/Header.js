import React from 'react';
import logo from '../assets/images/logo.svg';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
export class Header extends React.Component {
    //检测是否传了一个prop的safe check
    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        handleLogout: PropTypes.func.isRequired,
    }
    //login state作为props 传入
    // 如果login 就会显示出log out 选项， 否则不显示
    //this.props.handleLOgout是从app.js传下来的 传过来就变成了props
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Around</h1>
                {this.props.isLoggedIn ?
                    <a
                       className="logout"
                       onClick={this.props.handleLogout}
                    >
                        <Icon type="logout" />
                        {' '}Logout
                    </a> : null}
            </header>
        );
    }
}

