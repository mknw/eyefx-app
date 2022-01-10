window.onload = async function() {

    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    //CreateCalibrationTracker()
    //Set up the webgazer video feedback.
    var setup = function() {
        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();
};


// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;
window.onbeforeunload = function() {
    webgazer.end();
}

var outputInteraction = []

async function CreateCalibrationTracker() {
	await webgazer.setRegression('ridge') /* Ridge regression + Kalman Filter */
        // .setGazeListener(function(data, clock) {
          //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
          //   console.log(clock); 
        //})
        .saveDataAcrossSessions(true)
        .begin();
        webgazer.showVideoPreview(true)
        .showPredictionPoints(true); /* change to false to remove red dot */
}

/**
 * Restart the calibration process by clearing the local storage and resetting the calibration point
 */
function RestartCalibration(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    // document.getElementBy // should 
    // webgazer.clearData();
    ClearCalibration();
    CreateCalibrationTracker()
    PopUpInstruction();
    var canvas = document.getElementById("plotting_canvas");
    canvas.style.display = "";
    websiteDisplay = document.getElementById("websiteContainer");
    websiteDisplay.style.display = "none"
    // OperateCalibration()
}

function HideAllWebgazerPreviews(){
	webgazer.showFaceOverlay(false);
	webgazer.showVideo(false);
	webgazer.showFaceFeedbackBox(false);
}

/**
  * The webpage code.
  **/
function ShowWebsite() {
	webgazer.showVideoPreview(false) // slows down tracking by a lottt
	websiteDisplay = document.getElementById("websiteContainer");
	websiteDisplay.style.display = "block"
	webgazer.setGazeListener(function(data, clock) {
				// (X, Y) coordinates: data.x, data.y: 
				outputInteraction.push({
					ms: clock, // elapsed MS since webgazer.begin() was called
					x: data.x, // More info avail in the `data` object. It's 
					y: data.y  // possible to console.log to see what's in it.
				});
        })
}


function SkipTask() {
	swal({
		title: "Are you sure?",
		text: "We cannot grant this campaign will be available in the future. If something changed in the setting, such as head position or light condition, you can opt to Recalibrate the eye-tracker.",
		icon: "warning",
		buttons: {
			cancel: "Back to task", 
			skip: true,
			Recalibrate: true,
		},
		dangerMode: true,
	}).then((willSkip) => {
		switch (willSkip) {
			case "skip":
				swal("Terminating...");
				userSubmissionInput = document.getElementById("user-submission");
				eyetrackDataInput = document.getElementById("eyetracking-data");
				userSubmissionInput.value = 'invalid';
				eyetrackDataInput.value = 'invalid';
				// SUBMIT PROGRAMMATICALLY
				break

			case "recalibrate":
				RestartCalibration(); // FIX

			default:
				// do nothing
				console.log('Skipping the skipping.')
		}
	});
}



function ShowInputPrompt() {
	webgazer.end() // todo: check if conflicts with window.onbeforeunload (or removethe latter altogether)
	// add input questions
	
	swal({
		title: 'Answer the prompt:',
		text: 'What are the name of the authors of the White Paper published by Effect AI?', 
		content: 'input', 
		button: {
			text: "Submit",
			closeModal: true,
		}
	}).then(answer => {
			userSubmissionInput = document.getElementById("user-submission");
			eyetrackDataInput = document.getElementById("eyetracking-data");
			userSubmissionInput.value = answer
			eyetrackDataInput.value = JSON.stringify(outputInteraction)
			swal({
				text: 'Thank you for contributing! Your EFX will be transferred to your account once your submission has been validated. To earn more EFX, start another batch!',
				icon: "success",
				button: "Terminate"
			})
	})
}
