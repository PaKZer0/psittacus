import React, {Component} from "react";
import reactDOM from "react-dom";
import App from "./view/App.jsx";
import FaviconImage from "../res/favicon.png"
import L from "./model/utilities/Language.js";
import feather from 'feather-icons';

//set favicon
let link = document.createElement('link')
link.rel = 'shortcut icon';
link.href = FaviconImage;
document.head.appendChild(link);

//set title
let title = document.createElement("title")
title.innerHTML = L.app_name
document.head.appendChild(title)

//start the app
reactDOM.render(<App/>, document.getElementById("root"))
console.log('REPLACE');
feather.replace({ width: 56, height: 56 })