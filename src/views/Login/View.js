import React from 'react';
import axios from 'axios';
import { get, post }  from '../../lib';
import {  decode } from 'jsonwebtoken';
import $ from 'jquery/dist/jquery.min';
export default class extends React.Component{
    constructor(){
        super();
        this.state={
            usernameOrEmail:"",
            password:"",
            errors:""
        }
    }
    componentDidMount(){
        $("body").css("background-color","#f3f3f4");
    }
    onSubmit(e){
        e.preventDefault();
        this.setState({
            errors:""
        });
        const { usernameOrEmail, password} = this.state;

        post("api/auth/signin",{usernameOrEmail,password})
        .then((e)=>{
            let token = e.data.accessToken;
            let body = decode(token, {complete: true});
            let name = body.header.name;
            let roles = body.header.roles.map((e)=> e.authority);
            localStorage.setItem("token",token);
            localStorage.setItem("exp",body.payload.exp);
            localStorage.setItem("name",name);
            localStorage.setItem("roles",JSON.stringify(roles));
            window.location.reload();            
        })
        .catch((e)=>{
            this.setState({
                errors:"Your credentials are invalid. Please try again."
            })

        });
    }
    render(){
        return(

            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>

                    <h3>Welcome to Orange Jordon's Analytics Dashboard</h3>                    
                    <form  onSubmit={this.onSubmit.bind(this)}  className="m-t" role="form">
                        <div className="grey-bg text-danger text-center">
                            <p>{this.state.errors}</p> 
                        </div>
                        <div className="form-group">
                            <input value={this.state.usernameOrEmail} onChange={(e)=>this.setState({usernameOrEmail:e.target.value})} type="usernameOrEmail" className="form-control" placeholder="Username or Email"/>
                        </div>
                        <div className="form-group">
                            <input value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} type="password" className="form-control" placeholder="Password"/>
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
        
                        {/* <a href="#"><small>Forgot password?</small></a> */}
                        <p className="text-muted text-center"><small>If you don’t have an account, please contact us at 
                            <a href="mailto:info@wifimetropolis.com" target="_top"> info@wifimetropolis.com</a>
                            </small></p>
                        {/* <p className="text-muted text-center">You email us at <b>info@wifimetropolis.com</b> to get an account</p> */}
                        {/* <a className="btn btn-sm btn-white btn-block" href="register.html">Create an account</a> */}
                    </form>
                    <p className="m-t"> <small>Copyright &copy; 2018 WIFI Metropolis LLC. All rights reserved.</small> </p>
                </div>
            </div>
    
        );
    }
}