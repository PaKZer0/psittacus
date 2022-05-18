import React, { Component } from "react";
import SelectSound from "../../../../res/select.mp3"
import { playBase64 } from "../../../model/utilities/Recorder";

/**
 * A rounded, transparent menu button.
 */
export default class MenuButton extends Component{

    /**
     * 
     * @param {{
     * title : string, 
     * onClick : function, 
     * icon : string,
     * style : *,
     * highlight : boolean
     * }} props 
     */
    constructor(props){
        super(props)
        this.props = props
    }

    onClick = ()=>{
        //play select button sound
        playBase64(SelectSound)
        this.props.onClick()
    }

    render(){
        return  <button onClick={this.onClick } className="transparent_button" title={this.props.title} style={this.props.style}  style={   { background :   this.props.highlight? "red" : "transparent"  }   }       > <img src={this.props.icon} /> </button>
    }

}