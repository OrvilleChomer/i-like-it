/*
   i-like-it.js

*/


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




/*************************************************************************

 *************************************************************************/
function makeLikeButtonMarkup(sId) {
  const s=[];
  
  
} // end of function makeLikeButtonMarkup()


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





