import { PropositionData, WordDict } from "./PropositionBuilder"

//@ts-ignore
import { playBase64 } from "../utilities/Recorder"
//@ts-ignore
import CorrectSound from "../../../res/correct.mp3"
//@ts-ignore
import WrongSound from "../../../res/wrong.mp3"

export interface Proposition {
    play(): void
    check(userTranslation: string): number
    getScore(): number
    sentenceOneEntries(): string[][] //[string, string][]
    sentenceTwoEntries(): string[][]//[string, string][]
    getQuestionWordDict(): string[][] //[string, string][]
    getAnswerWordDict(): string[][]//[string, string][]
    getHash(): number
    readonly targetToNative: boolean
    readonly wordButtons: boolean
    readonly wordDict: WordDict
    readonly reverseDict: WordDict
    readonly extraWords: string
}

export function getProposition(data: PropositionData): Proposition {
    return new BaseProposition(data)
}

/**
* Min accuracy for user translation to be considered successful.
*/
export const MIN_PASSING_SCORE = 51


/**
 * A Proposition is an idea, expressed in two sentences in two different languages.
 * The constructor takes the json generated by a PropositionBuilder.
 */
class BaseProposition implements Proposition {

    protected score = 0 // STUPID!
    protected answerHidden = true

    constructor(
        readonly data: PropositionData,
        readonly sentenceOne = data.sentence_one,
        readonly sentenceTwo = data.sentence_two,
        readonly audioBase64 = data.audio_base64,
        readonly wordDict = data.word_dict,
        readonly reverseDict = data.reverse_dict,
        readonly targetToNative = data.target_to_native,
        readonly wordButtons = data.word_buttons,
        readonly extraWords = data.extra_words ?? '',
    ) {

    }

    /**
     * Play the audio of the sentence if the user is allowed to hear it.
     */
    play = () => {

        if ((!this.targetToNative) && this.answerHidden) {
            //user is barred from hearing when: they must still answer to a nativeToTarget question!
        } else {
            playBase64(this.audioBase64)
        }

    }

    /**
     * Give a rating from 0% to 100% to the user's translation.
     */
    check(userTranslation: string) {

        let correctSentence = this.targetToNative ? this.sentenceTwo : this.sentenceOne

        let counter = 0

        for (let userWord of userTranslation.split(/\s+/)) {
            if (correctSentence.split(/\s+/).includes(userWord)) {
                counter++
            }
        }

        let result = parseInt((100 * counter / this.sentenceTwo.split(/\s+/).length) + '')
        this.score = result

        //play sound if considered correct
        if (result > MIN_PASSING_SCORE) {
            playBase64(CorrectSound)
        } else {
            playBase64(WrongSound)
        }

        return result
    }

    /**
    * Get the user's score as a percentage (integer from 0 to 100)
    * @returns number
    */
    getScore = () => {
        return this.score
    }

    /**
     * Returns a [word, definition] list with sentenceOne's words.
     */
    sentenceOneEntries() {
        return this.sentenceOne.split(/\s+/).map(w => [w, this.wordDict[w]])
    }

    /**
     * Returns a [word, definition] list with sentenceTwo's words.
     */
    sentenceTwoEntries() {
        return this.sentenceTwo.split(/\s+/).map(w => [w, this.reverseDict[w]])
    }

    /**
     * If targetToNative==true, return the data for the target language.
     */
    getQuestionWordDict = () => {
        this.answerHidden = true
        return this.targetToNative ? this.sentenceOneEntries() : this.sentenceTwoEntries()
    }

    /**
     * If targetToNative==true, return the data for the native language.
     */
    getAnswerWordDict = () => {
        this.answerHidden = false
        return this.targetToNative ? this.sentenceTwoEntries() : this.sentenceOneEntries()
    }

    getHash = () => {
        return (this.sentenceOne + this.sentenceTwo).split("").map((c) => { return c.charCodeAt(0) }).reduce((a, b) => { return a + b })
    }

}

/**
* Used as a placeholder to make sure nothing breaks when you run out of real ones.
*/
export const NullProposition = getProposition({ sentence_one: "placeholder text: if u see it report a bug!", sentence_two: "testo che tiene il posto: se lo vedi segnala il baco!", audio_base64: "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==", word_dict: { "ciao": "hello" }, reverse_dict: { "hello": "ciao" }, target_to_native: true, word_buttons: false, extra_words: '' })
