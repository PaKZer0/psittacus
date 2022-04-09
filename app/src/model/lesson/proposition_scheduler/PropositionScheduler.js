import Proposition from "../proposition/Proposition"
import UserProgress from "../../utilities/UserProgress"

/**
 * **Abstract Class**. 
 * 
 * Subclasses decide what `Proposition` the student should see at any point of a `Lesson`. 
 * 
 * **Place subclasses in the `./classes` directory and export them as default, for automatic inclusion in build path.**
 * 
 * ## Subclasses must implement:
 * 
 * * `next()`: to decide what `Proposition` to point to next, and to set the `isLessonOver` flag.
 * 
 * ## Subclasses can override:
 * 
 * * `initSequence()`: to sort the `propositions` array in a different order than the one specified in the Lesson's json by the author of the Lesson.
 * 
 */
export default class PropositionScheduler {

    constructor(lessonId, propositions) {
        this.lessonId = lessonId
        this.propositions  = propositions
        this.initSequence()
        this.isLessonOver = false
    }

    /**
     * Initialize the `propositions` array.
     * 
     * Subclasses that override this should call `super.initSequence()`
     * first, to initialize the `propositions` array. Then they can sort it.
     * 
     */
    initSequence(){

    }

    /**
     * Decides whether or not to proceed to the next Proposition.
     * @returns {void}
     */
    next() {
        throw new Error("next() not implemented!")
    }

    /**
     * Did the student do enough exercise on these Propositions?
     * @returns {boolean}
     */
    isOver() {
        this.isLessonOver? UserProgress.saveLessonScore(this.lessonId, this.dumpScores()) : ""
        return this.isLessonOver
    }

    /**
     * Return the overall score of the student on these Propositions.
     * @returns {number}
     */
    overallScore() {
        return parseInt(this.propositions.map((p) => { return p.getScore() }).reduce((a, b) => { return a + b }) / this.propositions.length)
    }

    /**
     * Return the currently displayed Proposition.
     * @return {Proposition}
     */
    getCurrent() {
        return this.current
    }

    /**
     * Dumps info relative to the user's performance with this object's Propositions.
     * 
     * ```json
     * {
     * "last_taken" : unix epoch timestamp,
     * "overall" : overall score,
     * "propositions" : [ [propoHash1, score1], [propoHash2, score2]  ]
     * }
     * ```
     * 
     * @returns 
     */
    dumpScores() {

        return {
            "last_taken": new Date().getTime(),
            "overall": this.overallScore(),
            "propositions": this.propositions.map((p) => { return [p.getHash(), p.getScore()] })
        }

    }


}

