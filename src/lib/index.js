import axios from 'axios';
import { BASE_LINK } from '../config/consts';
//const BASE_LINK = "http://localhost:7777";
//const BASE_LINK = "http://db.wifimetropolis.com:7777/";
//const BASE_LINK = "";
export function post(url,data){
    if(url[0] !== "/")
        url = "/" + url;
    let config = {
        headers:{
            "Content-Type":"application/json"
        }
    };
    if(localStorage.getItem("token"))
        config.headers.Authorization = "Bearer " + localStorage.getItem("token");

    return axios.post(BASE_LINK + url,data,config);//
}
export function get(url){
    if(url[0] !== "/")
        url = "/" + url;
    let config = {
        headers:{
            "Content-Type":"application/json"
        }
    };
    if(localStorage.getItem("token"))
        config.headers.Authorization = "Bearer " + localStorage.getItem("token");
        
    return axios.get(BASE_LINK + url,config);
}