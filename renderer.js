let connectLastInlineButton = document.getElementById('connectLastInlineButton');
connectLastInlineButton.addEventListener('click', ()=>{
    connectLastInlineButtonInVisible();
    startInlineNotifications();
});

// why here?!?!?!
setConnectionStatus("");

function connectLastInlineButtonVisible(){ connectLastInlineButton.style.visibility = "visible"; }
function connectLastInlineButtonInVisible(){ connectLastInlineButton.style.visibility = "hidden"; }
