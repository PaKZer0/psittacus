import { getProposition, Proposition } from '../proposition/Proposition'
import { LessonData, Metadata } from './LessonBuilder'
import { LessonProgressData } from '../UserProgress'
import { Context } from '../Context'

//@ts-ignore
import Database from "../utilities/Database.js"


export interface Lesson {
    next(): void
    getCurrent(): Proposition
    isOver(context: Context): boolean
    getScore(): number
    getId(): string
    dumpScores(): LessonProgressData
    cacheLesson(): Promise<void>
    saveScore(context: Context): void
    setScheduler(context: Context): void
    getExplaination(): string
    getPropositions(): Proposition[]
}

export function getLesson(data: LessonData): Lesson {
    return new BaseLesson(data)
}

/**
 * A lesson contains a list of Propositions.
 * The constructor takes the json generated by `LessonBuilder`.
 */
class BaseLesson implements Lesson {

    protected scheduler: any

    constructor(
        readonly data: LessonData,
        readonly explanationText = data.explanation.text,
        readonly metadata = data.metadata,
        readonly propositions = data.propositions.map(p => { return getProposition(p) }),
    ) {
    }

    setScheduler(context: Context): void {
        this.scheduler = context.propoSchedFac.get(this)
    }

    /**
     * Point to the next proposition.
     */
    next() {
        this.scheduler.next()
    }

    /**
     * Get the current Proposition.
     */
    getCurrent() {
        return this.scheduler.getCurrent()
    }

    /**
     * Is this lesson over yet?
     */
    isOver(context: Context) {
        const over = this.scheduler.isOver()

        if (over) { //if this lesson is over, save the score
            this.saveScore(context)
        }

        return over
    }

    saveScore(context: Context): void {
        context.UP.saveLessonScore(this.getId(), this.dumpScores())
    }

    /**
     * Get Lesson's overall score.
     */
    getScore() {
        return parseInt((this.propositions.map((p) => { return p.getScore() }).reduce((a, b) => { return a + b }) / this.propositions.length) + '')
    }

    /**
     * Nominally identifies a Lesson.
     */
    getId() {
        return `author=${this.metadata.author};target_language=${this.metadata.target_language};source_language=${this.metadata.source_language};title=${this.metadata.title};`
    }

    /**
    * Dumps info relative to the user's performance with this Lesson.
    */
    dumpScores(): LessonProgressData {

        return {
            last_taken: new Date().getTime(),
            overall: this.getScore(),
            propositions: this.propositions.map((p) => { return [p.getHash() + '', p.getScore()] }),
            lessonId: this.getId()
        }

    }

    /**
     * Cache this Lesson, overwriting it in case of conflicting ids.
     */
    async cacheLesson() {

        await Database.get().cachedLessons().delete(this.getId())

        Database.get().cachedLessons().add({
            id: this.getId(),
            lesson: this.data
        })

    }

    getExplaination(): string {
        return this.explanationText
    }

    getPropositions(): Proposition[] {
        return this.propositions
    }

}


/**
 * Parses a Lesson id
 */
export function parseId(lessonId: string): Metadata {
    return Object.fromEntries(lessonId.split(";").filter(x => !!x).map(x => x.split("=")))
}

/**
 * Load a previously cached Lesson on the DB back into memory. 
 */
export async function getCachedLessonById(id: string) {
    const record = await Database.get().cachedLessons().get(id)
    return getLesson(record.lesson)
}

/**
 * Check if the id of a Lesson matches a certain category of Lessons.
 */
export function isMetadataMatching(lessonId: string, metadataFilter: Metadata) {

    const metadata = parseId(lessonId)

    return (
        ((metadataFilter.author || metadata.author) == metadata.author) &&
        ((metadataFilter.source_language || metadata.source_language) == metadata.source_language) &&
        ((metadataFilter.target_language || metadata.target_language) == metadata.target_language) &&
        ((metadataFilter.title || metadata.title) == metadata.title)
    )

}

/**
* Retrieve the ids of the lessons in history, with optional filtering on their metadata.
*/
export function getLessonIdsHistory(context: Context, metadataFilter?: Metadata) {

    let ids = context.UP.lessonScores().map(l => l.lessonId)

    if (metadataFilter) {
        return ids.filter(id => isMetadataMatching(id, metadataFilter))
    }

    return ids
}