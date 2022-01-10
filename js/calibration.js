var nCalClicks = 2;
var PointCalibrate = 0;
var CalibrationPoints={};
// var canvas = document.getElementById("plotting_canvas");


/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  var canvas = document.getElementById("plotting_canvas");
  $(".Calibration").hide();
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}
function DeleteCanvas(){
  var canvas = document.getElementById("plotting_canvas");
  canvas.style.display = "none";
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title:"Calibration",
    text: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
    buttons:{
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPoint();
  });

}
/**
  * Show the help instructions right at the start.
  */
function helpModalShow() {
    $('#helpModal').modal('show');
}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
$(document).ready(OperateCalibration);

function OperateCalibration(){
  ClearCanvas();
  helpModalShow();
  CalibrationPoints = {}
  //console.log(CalibrationPoints)
  $(".Calibration").click(function(){ // click event on the calibration buttons
      //console.log('click!')
      var id = $(this).attr('id');
      if (!CalibrationPoints[id]){ // initialises if not done
        //console.log("initializing cal point counter for", id)
        CalibrationPoints[id]=0;
      }
      CalibrationPoints[id]++;
		 //console.log(id, 'incremented: ', CalibrationPoints[id])

      if (CalibrationPoints[id]==nCalClicks){ //only turn to yellow after 5 clicks
        $(this).css('background-color','yellow');
        $(this).prop('disabled', true); //disables the button
        PointCalibrate++;
      }else if (CalibrationPoints[id]<nCalClicks){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.1*CalibrationPoints[id]+0.1;
        $(this).css('opacity',opacity);
      }

      //Show the middle calibration point after all other points have been clicked.
      if (PointCalibrate == 8){
        $("#Pt5").show();
      }

      if (PointCalibrate >= 9){ // last point is calibrated
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            $(".Calibration").hide();
            $("#Pt5").show();
            // clears the canvas
            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            // notification for the measurement process
            swal({
              title: "Calculating measurement",
              text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: true
            }).then( isConfirm => {

                // makes the variables true for 5 seconds & plots the points
                $(document).ready(function(){
                  store_points_variable();
                  sleep(5000).then(() => {
                      stop_storing_points_variable(); 
                      var past50 = webgazer.getStoredPoints(); // retrieve the stored points
                      webgazer.clearGazeListener() // stop recording predictions.
                      var precision_measurement = calculatePrecision(past50);
                      var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                      document.getElementById("Accuracy").innerHTML = accuracyLabel;
                      swal({
                        title: "Achieved accuracy: " + precision_measurement + "%",
                        allowOutsideClick: false,
                        buttons: {
                          cancel: "Recalibrate",
                          confirm: true,
                        }
                      }).then(isConfirm => {
                          if (isConfirm){
                            //clear the calibration & hide the last middle button
                            //ClearCanvas();
                            DeleteCanvas();
									 webgazer.clearGazeListener()
                            ShowWebsite()

                          } else {
                            //use restart function to restart the calibration
                            document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                            //webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                          }
                      });
                  });
                });
            });
          }
    });
};

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  $(".Calibration").show();
  $("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  // Clear data from WebGazer
  webgazer.clearData()
  $(".Calibration").css('background-color','red');
  $(".Calibration").css('opacity',0.2);
  $(".Calibration").prop('disabled',false);
  $("#plotting-canvas").css('display', '');

  CalibrationPoints = {};
  PointCalibrate = 0;
  // reset worker output Interaction to be sent to Requirer.
  outputInteraction = [] 
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
