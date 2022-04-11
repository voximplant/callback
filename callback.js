var call1, call2, data;
var callerID = "Please place your caller id here";

VoxEngine.addEventListener(AppEvents.Started, handleScenarioStart);
VoxEngine.addEventListener(AppEvents.HttpRequest, handleHttpRequest);

function handleHttpRequest(e) {
  // Handle HTTP request sent using media_session_access_url
  VoxEngine.terminate();
}

function handleScenarioStart(e) {
  // Data can be passed to scenario using customData
  // script_custom_data param in StartScenarios HTTP request will be available to scenario as customData
  // in this scenario we will pass number1:number2 string via script_custom_data
  data = VoxEngine.customData();
  data = data.split(":");
  // start scenario - calling number 1
  call1 = VoxEngine.callPSTN(data[0], callerID);
  // assign event handlers
  call1.addEventListener(CallEvents.Connected, handleCall1Connected);
  call1.addEventListener(CallEvents.Failed, handleCall1Failed);
  call1.addEventListener(CallEvents.Disconnected, handleCall1Disconnected);
}

function handleCall1Failed(e) {
  // failure reason available here 
  var code = e.code,
      reason = e.reason;
  // we can send it to outer world using HTTP request
  Net.httpRequest("http://somewebservice", function(e1) {
    // HTTP request info - e1.code, e1.text, e1.data, e1.headers
    // terminate session
    VoxEngine.terminate();
  });
}

function handleCall1Disconnected(e) {
  VoxEngine.terminate();
}

function handleCall1Connected(e) {
  // first call connected successfully, play message
  call1.say("Hi, this call is from callback service, please wait", Language.US_ENGLISH_FEMALE);
  call1.addEventListener(CallEvents.PlaybackFinished, function(e1) {
  	// after message played - calling number 2
    call2 = VoxEngine.callPSTN(data[1], callerID);
    // assign event handlers
  	call2.addEventListener(CallEvents.Connected, handleCall2Connected);
  	call2.addEventListener(CallEvents.Failed, function(e2) { 
      if (e2.code == 486) {
        call1.say("Number is busy or rejected the call", Language.US_ENGLISH_FEMALE);  
      } else if (e2.code == 404) {
        call1.say("Invalid number", Language.US_ENGLISH_FEMALE); 
      } else if (e2.code == 402) {
        call1.say("Insufficient funds on your account", Language.US_ENGLISH_FEMALE); 
      } else if (e2.code == 603) {
        call1.say("Call was rejected", Language.US_ENGLISH_FEMALE); 
      } else if (e2.code == 487) {
        call1.say("Request terminated or phone was not picked up", Language.US_ENGLISH_FEMALE); 
      } else if (e2.code == 480) {
        call1.say("Destination number is unavailable", Language.US_ENGLISH_FEMALE); 
      } else {
          call1.say(e2.reason, Language.US_ENGLISH_FEMALE);
          call1.say("Unfortunately, the connection can't be established.", Language.US_ENGLISH_FEMALE);  
        }
        call1.addEventListener(CallEvents.PlaybackFinished, function(e3) { VoxEngine.terminate(); });     
    });
  	call2.addEventListener(CallEvents.Disconnected, function(e2) { VoxEngine.terminate(); });
  });
}

function handleCall2Connected(e) {
  // connect two calls with each other - media 
  VoxEngine.sendMediaBetween(call1, call2);
  // and signalling
  VoxEngine.easyProcess(call1, call2);
}
