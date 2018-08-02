import React, { Component } from 'react';
// import { Link, Location } from 'react-router';
import $ from 'jquery';
import { Link } from 'react-router-dom'
import Secured from './Securelink';
class Navigation extends Component {

    componentDidMount() {
        const { menu } = this.refs;
        $(menu).metisMenu();
    }
    componentWillMount(){

    }
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    secondLevelActive(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    }
    _getWelcomeMessage(){
        let list = [
            "Welcome!",
            "Have a nice day!",
            "Good day!",
            "Hello there!",
            "It’s good to see you."
        ];
        return list[Math.floor(Math.random() * list.length)];
    }
    render() {
        return (
            <nav className="navbar-default navbar-static-side" role="navigation">
                    <ul className="nav metismenu" id="side-menu" ref="menu">
                        <li className="nav-header">
                            <div className="dropdown profile-element"> 
                                <span></span>
                                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                                    <span className="clear"> 
                                        <span className="block m-t-xs"> 
                                           {/* <strong className="font-bold">{`${localStorage.getItem("name")}`}</strong> */}
                                        </span> 
                                        <span className="text-muted text-xs block">
                                           { this._getWelcomeMessage()} 
                                        </span> 
                                    </span> 
                                </a>
                                {/* <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                    <li><a href="#"> Logout</a></li>
                                </ul> */}
                            </div>
                            <div className="logo-element">
                                OR+
                            </div>
                        </li>
                        <li className={this.activeRoute("/overview")}>
                            <Link to="/overview"><i className="fa fa-th-large"></i> <span className="nav-label">Highlights</span></Link>
                        </li>
                        <li className={this.activeRoute("/map")}>
                            <Link to="/map"><i className="fa fa-map"></i> <span className="nav-label">Maps</span></Link>
                        </li>                                                                               
                    </ul>

            </nav>
        )
    }
}

export default Navigation