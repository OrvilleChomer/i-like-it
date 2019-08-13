/*****************************************************************************
   i-like-it.js
   
   expecting JQuery for some functionality...

 *****************************************************************************/


const sILikeItUrl = "https://i-like-it.glitch.me/api";
let apiResultsNd;

/*************************************************************************
function is used for API calls to server
*************************************************************************/
async function apiCall(cmd, dataPosted, fnSuccess,fnFailure) {
  console.log("apiCall function called");
  console.log("cmd="+cmd);
  
  dataPosted.cmd = cmd;
  
  const options = {
    method:'POST',
    body:JSON.stringify(dataPosted),
    headers:{"Content-Type":"application/json"}
  }; // end of options definition
  
  try {
    
    console.log("about to do an asyncronous fetch() call...");
    console.log("End-point URL: "+sILikeItUrl);
    const response = await fetch(sILikeItUrl, options);
    console.log("about to process response returned from fetch()...");
    const returnedData = await response.json();

    console.log(returnedData);
    
    if (returnedData.status === 'ok') {
      // OK
      console.log("API call returned a result of 'ok'");


      fnSuccess(returnedData);
    } else {
      // NOT OK
      console.log("API call did NOT return a result of 'ok'... it returned: "+returnedData.result);
      
      fnFailure(returnedData);
    } // end if
  } catch(err) {
      // Caught a JavaScript error...
      let returnedData = {};
      returnedData.result = "jsError";
      returnedData.message = err.message;
      returnedData.fileName = err.fileName;
      returnedData.lineNumber = err.lineNumber;

      console.log("JavaScript Error Occurred...");
      console.log(err);
      fnFailure(returnedData);
  } // end of try/catch
  
} // end of function apiCall()
// #####################################################################################################


const LikeButtonInfoById = [];
const LikeButtonIdsByIndex = [];





/*************************************************************************
  Call this once somewhere in the page setup
  (buttons need to be part of markup before calling)
 *************************************************************************/
function setupPageLikeButtons() {
  console.log("setupPageLikeButtons() called");
  let sLikeButtonClassName = "likeBtn";
  const ids = [];
  
  const buttons = $("."+sLikeButtonClassName);
  const nMax = buttons.length;
  
  for (let n=0;n<nMax;n++) {
    const button = buttons[n];
    
    button.style.width = "70px";
    let sId = button.id;
    
    ids.push(sId);
    
    button.addEventListener('click', likeButtonClicked);
  } // next n
  
  const iData = {};
  
  iData.buttonIds = ids;
  
  apiCall("likeButtonValues", iData, likeButtonValuesSuccess, likeButtonValuesFailure);
  
} // end of function setupPageLikeButtons() 





/*************************************************************************

 *************************************************************************/
function likeButtonValuesSuccess(returnedData) {
  console.log("likeButtonValuesSuccess() called");
  
  const likeButtonsFound = returnedData.likeButtonsFound;
  const nMax = likeButtonsFound.length;
  
  for (let n=0;n<nMax; n++) {
    const buttonInfo = likeButtonsFound[n];
    const button = $("#"+buttonInfo.buttonId)[0];
    const sKey = buttonInfo.buttonKey;
    let sCaption = "like";
    let sCurrentValue;
    
    if (localStorage.getItem(sKey)) {
      sCurrentValue = localStorage.getItem(sKey);
      
      if (sCurrentValue=== "liked") {
        sCaption = "unlike";
      } // end if
    } // end if (localStorage.getItem(sKey)) 
    
    if (buttonInfo.likeCount > 0) {
      sCaption = sCaption + " (" + buttonInfo.likeCount + ")";
    } // end if
    
    button.innerHTML = sCaption;
  } // next n
  
} // end of function likeButtonValuesSuccess()





/*************************************************************************

 *************************************************************************/
function likeButtonValuesFailure(returnedData) {
  console.log("likeButtonValuesFailure() called");
} // end of function likeButtonValuesFailure()




/*************************************************************************

 *************************************************************************/
function likeButtonClicked(evt) {
  const button = evt.target;
  const sKey = "likeBtn_"+button.id;
  let sCurrentValue = "unliked"; // default
  
  if (localStorage.getItem(sKey)) {
    sCurrentValue = localStorage.getItem(sKey);
  } // end if
  
  if (sCurrentValue === "unliked") {
    sCurrentValue = "liked";
    button.innerHTML = "unlike";
  } else {
    sCurrentValue = "unliked"; 
    button.innerHTML = "like";
  } // end if/else
  
  const iData = {};
  iData.buttonKey = sKey;
  iData.buttonId = button.id;
  iData.currentValue = sCurrentValue;
  localStorage.setItem(sKey, sCurrentValue);
  apiCall("likeButtonClicked", iData, likeButtonClickedSuccess, likeButtonClickedFailure);
  
} // end of function likeButtonClicked()



/*************************************************************************

 *************************************************************************/
function likeButtonClickedSuccess(returnedData) {
  console.log("likeButtonClickedSuccess() called");
  console.log("returnedData.buttonId="+(returnedData.buttonId));
  const button = $("#"+returnedData.buttonId)[0];
  const sCurrentValue = localStorage.getItem(returnedData.buttonKey);
  let sCaption = "??";
  
  if (sCurrentValue === "unliked") {
    sCaption = "like";
  } else {
    sCaption = "unlike";
  } // end if/else
  
  if (returnedData.likeCount > 0) {
    sCaption = sCaption + " ("+(returnedData.likeCount)+")";
  } // end if
  
  button.innerHTML = sCaption;
  
} // end of function likeButtonClickedSuccess()





/*************************************************************************

 *************************************************************************/
function likeButtonClickedFailure(returnedData) {
  console.log("likeButtonClickedFailure() called");
} // end of function likeButtonClickedFailure()




/*************************************************************************

 *************************************************************************/
function setApiResultsNode(nd) {
  console.log("setApiResultsNode() function called");
  apiResultsNd = nd;
} // end of function setApiResultsNode() 




/*************************************************************************

 *************************************************************************/
function performBasicApiCall() {
  const iData = {};
  console.log("performBasicApiCall() function called");
  apiCall("basicCall", iData, basicCallSuccess, basicCallFailure);
} // end of function performBasicApiCall()



/*************************************************************************

 *************************************************************************/
function basicCallSuccess(returnedData) {
  console.log("basicCallSuccess() function called");
  
  if (apiResultsNd) {
    apiResultsNd.innerHTML = "<b>basic call successful</b><br>";
    
  } // end if
  
} // end of function basicCallSuccess()



/*************************************************************************

 *************************************************************************/
function basicCallFailure(returnedData) {
  console.log("basicCallFailure() function called");
  if (apiResultsNd) {
    apiResultsNd.innerHTML = "basic call failure";
  } // end if
} // end of function basicCallFailure()



