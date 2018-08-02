import React from 'react';
import Progress from '../common/Progress';
import Navigation from '../common/Navigation';
import Footer from '../common/Footer';
import TopHeader from '../common/TopHeader';
import { correctHeight, detectBody } from './Helpers';
import $ from 'jquery/dist/jquery.min';
import {  Route, Switch} from 'react-router';
import Routes from '../../config/routes';

/*
* This is the main layout componenet
*/
class Main extends React.Component {

    render() {
        let wrapperClass = "gray-bg " //+ this.props.children[0].location.pathname;
        return (
            <div id="wrapper">
                <Progress />
                <Navigation location={{pathname:"this.props.location"}}/>

                <div id="page-wrapper" className={wrapperClass}>

                    <TopHeader />
                        {Routes}
                        {/* {this.props.children} */}
                        <div className="clearfix"></div>
                    <Footer />

                </div>

            </div>

        )
    }

    componentDidMount() {

        // Run correctHeight function on load and resize window event
        $(window).bind("load resize", function() {
            correctHeight();
            detectBody();
        });

        // Correct height of wrapper after metisMenu animation.
        $('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }
}

export default Main