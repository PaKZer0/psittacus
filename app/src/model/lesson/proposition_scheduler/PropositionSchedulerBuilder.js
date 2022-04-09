import Settings from "../../utilities/Settings"

let schedulers = require.context("./classes", false, /.js$/).keys().map(require.context("./classes", false, /.js$/))
schedulers = schedulers.map(s=> {return [s.default.prototype.constructor.name,  s.default]  })
schedulers = Object.fromEntries(schedulers)

/**
 * Builds different kinds of Schedulers based on the available
 * implementations in `./classes` and the currently selected 
 * implementation in `Settings`.
 */
export default class PropositionSchedulerBuilder{

    static getScheduler(lessonId, propositions){        
    
        try{
            return new schedulers[Settings.get(Settings.SCHEDULER)](lessonId, propositions)
        }catch{
            return new schedulers[this.getTypes()[0]](lessonId, propositions)
        }
        
    }

    static getTypes(){
        return Object.keys(schedulers)
    }

}