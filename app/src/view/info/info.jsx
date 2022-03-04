import React, { Component } from "react";
import L from "../../model/language.js";



export default class Info extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>{L.welcome}</h1>
                <p>{L.to_use_app_offline}</p>
                <p>{L.win_linux_save_offline}</p>
                <p>{L.mac_save_offline}</p>

                <h1>{L.link_to_source_code_title}</h1>
                <a href={L.link_to_source_code} target="_blank">{L.link_to_source_code}</a>

                <p>{L.license_notice}</p>

            </div>


        )
    }
}