$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  // game 
  var trivia = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 15,
    timerOn: false,
    timerId : '',
    
    // qustions and answers
    questions: {
      q1: 'How did Daenerys Targaryen hatch her dragons?',
      q2: 'Which of the following can kill White Walkers?',
      q3: 'How many times did Jon Snow Die?',
      q4: 'How many Kingdoms are there in the GOT universe?',
      q5: "What was name of Ned Starks sword?",
      q6: 'Who won the Game of Thrones?',
      q7: "Jon Snow is really a "
      
    },
    options: {
      q1: ['storm', 'fire', 'death', 'frozen'],
      q2: ['wildfire', 'sand', 'dragonglass', 'poison'],
      q3: ['5', '2', '1', '3'],
      q4: ['7', '8', '11', '6'],
      q5: ['Loyalty','Wolfsbane','Northguard','Ice'],
      q6: ['Nobody','Sansa','Jon','Cersei'],
      q7: ['Targaryen', 'Tully', 'Lannister','Tyrell'],
    },
    answers: {
      q1: 'fire',
      q2: 'dragonglass',
      q3: '1',
      q4: '7',
      q5: 'Ice',
      q6: 'Nobody',
      q7: 'Targaryen'
    },
    
    // method to start game
    // restarting game results
     startGame: function(){ 
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // show questions and options loop
    nextQuestion : function(){
      
      // set timer to 15 seconds each question
      trivia.timer = 15;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // stop timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets questions then indexes current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      //  array of user options for current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // if the runs out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>You have run out of time! The answer is '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // results of game
        $('#results')
          .html('<h3>Here are your results!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Winter is coming!</p>');
        
        // hide game 
        $('#game').hide();
        
        // show start for a new game
        $('#start').show();
      }
      
    },
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>You are right.</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3> Wrong'+ currentAnswer +'</h3>');
      }
      
    },
    // remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // next question
      trivia.nextQuestion();
       
    }
  
  }