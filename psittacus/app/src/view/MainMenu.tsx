import React, { Component } from "react";
import { Context } from "../model/Context";

// @ts-ignore
import MainMenuButton from "./recycled/buttons/MainMenuButton.jsx";


export default class MainMenu extends Component<{ c: Context }> {

    render(): React.ReactNode {

        return (<div style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
            <MainMenuButton title={this.props.c.L.info} icon={this.props.c.icons.Info} onClick={() => this.props.c.setPage('info')} />
            <MainMenuButton title={this.props.c.L.download_lessons} icon={this.props.c.icons.Download} onClick={() => this.props.c.setPage('download')} />
            <MainMenuButton title={this.props.c.L.take_lesson} icon={this.props.c.icons.BookOpen} onClick={() => this.props.c.setPage('open-lesson')} />
            <MainMenuButton title={this.props.c.L.history} icon={this.props.c.icons.RotateCcw} onClick={() => this.props.c.setPage('history')} />
            <MainMenuButton title={this.props.c.L.craft_new_lesson} icon={this.props.c.icons.FilePlus} onClick={() => this.props.c.setPage('craft-new-lesson')} />
            <MainMenuButton title={this.props.c.L.edit_lesson} icon={this.props.c.icons.Edit} onClick={() => this.props.c.setPage('edit-lesson')} />
            <MainMenuButton title={this.props.c.L.settings} icon={this.props.c.icons.Settings} onClick={() => this.props.c.setPage('settings')} />
        </div>)
    }

}