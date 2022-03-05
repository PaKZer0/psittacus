import { playBase64 } from "./recorder.js"
import CorrectSound from "../../res/correct.mp3"
import WrongSound from "../../res/wrong.mp3"


export { Proposition }

/**
 * A Proposition is an idea, expressed in two sentences in two different languages.
 * The constructor takes the json generated by a PropositionBuilder.
 */
class Proposition {

    static MIN_PASSING_SCORE = 51

    constructor(jsonData) {
        this.sentenceOne = jsonData.sentence_one
        this.sentenceTwo = jsonData.sentence_two
        this.audioBase64 = jsonData.audio_base64
        this.wordDict = jsonData.word_dict
        this.reverseDict = jsonData.reverse_dict
        this.targetToNative = jsonData.target_to_native ?? true
        
    }

    /**
     * Play the audio of the sentence.
     */
    play = () => {
        playBase64(this.audioBase64)
    }

    /**
     * Give a rating from 0% to 100% to the user's translation.
     * @param {*} users_translation 
     * @returns 
     */
    check(users_translation) {


        let correctSentence = this.targetToNative ? this.sentenceTwo : this.sentenceOne


        let counter = 0;
        for (let userWord of users_translation.split(/\s+/)) {
            if (correctSentence.split(/\s+/).includes(userWord)) {
                counter++
            }
        }

        let result = parseInt(100 * counter / this.sentenceTwo.split(/\s+/).length)
        this.score = result

        if (result > 50) {
            playBase64(CorrectSound)
        } else {
            playBase64(WrongSound)
        }

        return result
    }

    /**
     * If targetToNative==true, return the data for the target language.
     */
    getQuestionWordDict = ()=>{
        return this.targetToNative? this.wordDict : this.reverseDict
    }

    /**
     * If targetToNative==true, return the data for the native language.
     */
    getAnswerWordDict = ()=>{
        return this.targetToNative? this.reverseDict : this.wordDict
    }

    /**
     * Get the user's score as a percentage (integer from 0 to 100)
     * @returns number
     */
    getScore = ()=>{
        return this.score
    }






}


