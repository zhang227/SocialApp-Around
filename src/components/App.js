import React, { Component } from 'react';
import { Header } from './Header';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants';
import '../style/App.css';
class App extends Component {
    //state写在所有要用这个state的component的LCA上
    //state initlization
    state = {
        //local storage是浏览器一个抗刷新的storage 会一直存在 存入token用来保证刷新之后不需要重新登陆
        //！！表示强制转换为boolean 然后强制取反
        //local storage per page的 每个page一个
        isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
    }
    handleLogin = (token) => {

        this.setState({ isLoggedIn: true });
        localStorage.setItem(TOKEN_KEY, token);
    }
    //remove storage
    handleLogout = () => {
        this.setState({ isLoggedIn: false });
        localStorage.removeItem(TOKEN_KEY);
    }
    render() {
        return (
            //因为要在header里面用islogin这个state 来控制logout 所以要把state传入
            //把handlelogour传下去
            <div className="App">
                <Header isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout}/>
                <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin}/>
            </div>
        );
    }
}
export default App;