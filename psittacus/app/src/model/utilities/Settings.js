/**
 * A wrapper around localStorage, that provides
 * syntactic sugar to set and get global settings params.
 * 
 * ### Usage:
 * 
 * Settings.getInstance().set(Settings.TEST, "new value")
 * 
 * let val = Settings.getInstance().get(Settings.TEST)
 * 
 */
export default class Settings {

    //Keys:
    static PROPOSITION_SCHEDULER = "PROPOSITION_SCHEDULER"
    static LESSON_SCHEDULER = "LESSON_SCHEDULER"
    static APP_LANGUAGE = "APP_LANGUAGE"
    static DEV_OPTIONS_ENABLED = "DEV_OPTIONS_ENABLED"
    static INPUT_TYPE = "INPUT_TYPE"

    static ALWAYS_KEYBOARD = 'ALWAYS_KEYBOARD'
    static ALWAYS_BUTTONS = 'ALWAYS_BUTTONS'
    static LESSON_DEFAULT = 'LESSON_DEFAULT'
    static inputTypes = ['ALWAYS_KEYBOARD', 'ALWAYS_BUTTONS', 'LESSON_DEFAULT']


    //instance
    static instance = null

    constructor() {
        this.settingsDict = JSON.parse(localStorage.getItem("SETTINGS") ?? "{}")
    }

    /**
     * 
     * @returns {Settings}
     */
    static getInstance() {
        return Settings.instance = Settings.instance ?? new Settings()
    }

    /**
     * 
     * @param {string} key 
     * @param {*} value 
     */
    set(key, value) {
        this.settingsDict[key] = value
        localStorage.setItem("SETTINGS", JSON.stringify(this.settingsDict))
    }

    get(key) {
        return this.settingsDict[key]
    }

}



