/**
 * A lesson is mainly a list of Propositions.
 * The constructor takes the json generated by a LessonBuilder.
 */
class Lesson{

    constructor(jsonData){
        this.propositions = jsonData.propositions.map( p => {return new Proposition(p)} )
        this.iterator = this.propositions.values()
        this.next()
    }

    next(){
        this.current = this.iterator.next().value
    }

    getCurrent(){
        return this.current
    }

}