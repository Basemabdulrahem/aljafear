import React from 'react';
import { smoothlyMenu } from '../layouts/Helpers';
import $ from 'jquery/dist/jquery.min';

class TopHeader extends React.Component {

    toggleNavigation(e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }
    logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("exp");
        localStorage.removeItem("name");
        localStorage.removeItem("roles");
        window.location.reload();
    }
    render() {
        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-static-top white-bg" role="navigation" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                    </div>
                    <ul className="nav navbar-top-links navbar-right">
                        <li>
                            <a href="#" onClick={this.logout.bind(this)}>
                                <i className="fa fa-sign-out"></i> Log out
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default TopHeader