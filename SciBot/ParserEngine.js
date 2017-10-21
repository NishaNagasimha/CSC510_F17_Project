'use strict'

var { DatabaseManager } = require('./DatabaseManager');

/**
 * Parser Engine for the bot
 */
class ParserEngine {
    constructor(){
        this.output_message = "I don't understand";
    }

    parse(message){
        var resolved = false;

        //signoff - usecase1
        if(!resolved && this.messageForSignOff(message))
            resolved = true;
        //daily status - usecase1
        if(!resolved && this.checkDailyStatus(message))
            resolved = true;
        //daily status - usecase1
        if(!resolved && this.addUpdateStatus(message))
            resolved = true;
        //generate reports - usecase2
        if(!resolved && this.checkIfReportToBeGenerated(message))
            resolved = true;
        
        // TODO: create other rules here

        return this.output_message;
    }

    messageForSignOff(message){
      //  var obj = new RegExp('report', 'i');
        var action = new RegExp('sign(ing) off', 'i');

        if(action.test(message)){
            // Question for status

            this.output_message = 'Have you updated your daily status?';

            return true;
        }

        return false;
    }

    checkDailyStatus(message){
          var obj = new RegExp('yes|no', 'i');
          var action = new RegExp('updated|not updated', 'i');
  
          if(obj.test(message) && action.test(message)){
              // Reply for status
              var yesReply = new RegExp('yes', 'i');
              this.output_message = yesReply.test(message) ? 'Okay, thank you! You may sign off.' : 'Please update your daily status.';
  
              return true;
          }
  
          return false;
      }

    checkIfReportToBeGenerated(message){
        var obj = new RegExp('report', 'i');
        var action = new RegExp('generate(d?)', 'i');
        var time = new RegExp('(current|this|previous) sprint', 'i');

        if(obj.test(message) && action.test(message) && time.test(message)){
            // Report to be generated
            var currentSprint = new RegExp('(current|this) sprint', 'i');

            this.output_message = currentSprint.test(message) ? DatabaseManager.generateReport('current') : DatabaseManager.generateReport('previous');

            return true;
        }

        return false;
    }
}

module.exports.ParserEngine = ParserEngine;

