import { getSettings, GetSettingsArgs, Settings, settingsKeys, SettingsKeys } from "./Settings"
import { getUserProgress, UserProgress } from "./UserProgress"
import { LangPack } from "../../res/lang_packs/LangPack"
import { english } from "../../res/lang_packs/english"
import { italian } from "../../res/lang_packs/italian"
import { spanish } from "../../res/lang_packs/spanish"
import { getLessonBuilder, LessonBuilder } from "./lesson/LessonBuilder"
import { Lesson } from "./lesson/Lesson"

type ContextKey =
    'RECORDING'
    | 'EDITING_MODE'
    | 'USER_ACCURACY'
    | 'SOLUTION_HIDDEN'
    | 'OVERALL_USER_ACCURACY'
    | 'PLAY_MODE'
    | SettingsKeys

type Page = { page: any, pageId: string }

export interface Context extends Settings {
    L: LangPack
    availableLangs: string[]
    UP: UserProgress
    getLessonBuilder(): LessonBuilder
    setLessonBuilder(lessonBuilder: LessonBuilder): void
    clearLessonBuilder(): void
    get<T extends string | boolean | number>(key: ContextKey): T
    set(key: ContextKey, value: string | boolean | number): void
    forceUpdate(): void
    getLesson(): Lesson
    setLesson(lesson: Lesson): void
    getCurrentPage(): Page
    setCurrentPage(page: Page): void
    setForceUpdate(forceUpdate: () => void): void
}

export interface GetContextArgs extends GetSettingsArgs {
    langPacks: { [langName: string]: LangPack }
    S: Settings
    UP: UserProgress
    lessonBuilder?: LessonBuilder
    forceUpdate?: () => void
}

export function getContext(opts: GetContextArgs): Context {
    return new BaseContext({
        UP: getUserProgress(),
        forceUpdate: opts.forceUpdate,
        S: getSettings({}),
        langPacks: { english, italian, spanish }
    })
}

class BaseContext implements Context {

    protected lesson?: Lesson
    protected currentPage?: Page

    constructor(
        readonly opts: GetContextArgs,
        readonly UP = opts.UP,
        readonly inputTypes = opts.S.inputTypes,
        protected lessonBuilder: LessonBuilder | undefined = opts.lessonBuilder ?? getLessonBuilder({}),
        protected contextDict = {} as any,
    ) {
    }

    get L() {
        return this.opts.langPacks[this.opts.S.get<string>('APP_LANGUAGE')]
    }

    get availableLangs() {
        return Object.keys(this.opts.langPacks)
    }

    getLessonBuilder(): LessonBuilder {
        return this.lessonBuilder ?? (this.lessonBuilder = getLessonBuilder({}))
    }

    setLessonBuilder(lessonBuilder: LessonBuilder): void {
        this.lessonBuilder = lessonBuilder
        this.forceUpdate()
    }

    clearLessonBuilder(): void {
        this.lessonBuilder = undefined
    }

    set(key: ContextKey, value: string | number | boolean): void {

        if (settingsKeys.includes(key as any)) {
            this.opts.S.set(key as any, value)
        } else {
            this.contextDict[key] = value
        }

        this.forceUpdate()

    }

    get<T extends string | number | boolean>(key: ContextKey): T {
        return this.contextDict[key]
    }

    setLesson(lesson: Lesson): void {
        this.lesson = lesson
    }

    getLesson() {

        if (!this.lesson) {
            throw 'No Lesson in Context!'
        }

        return this.lesson

    }

    getCurrentPage(): Page {

        if (!this.currentPage) {
            throw 'No currentPage in Context!'
        }

        return this.currentPage
    }

    setCurrentPage(page: Page): void {
        this.currentPage = page
    }

    setForceUpdate(forceUpdate: () => void): void {
        this.opts.forceUpdate = forceUpdate
    }

    forceUpdate = (): void => {
        this.opts?.forceUpdate?.()
    }

}