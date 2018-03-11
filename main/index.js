const {fork} = require('child_process');
const fs = require('fs');
const forked = fork('./resources/app.asar/main/worker.js');
//const forked = fork('./main/worker.js');
console.log(forked);
forked.on('message', (msg) => {
  console.log("received");
  for(var key in msg)
  {
    if(key == 'text')
    {
      console.log(msg[key]);
    }
    else if(key === 'queue-popped')
    {
      if(msg[key])
        openModal('match-detected');
      else
        closeModal('match-detected');
    }
    else
      setButton(key, msg[key]);
  }
});

function shutdown()
{
  forked.send({exit: true});
  forked.kill(0);
  addon.shutdownGDIPlus();
}
function openModal(id)
{
  $('#' + id).modal({closeable:false}).modal('show');
}
function closeModal(id)
{
  $('#' + id).modal('hide');
}

function toggleButton(id, fp, fp_input)
{
  if(fp != null)
    fp(fp_input);
  var $element = $("#" + id);
  if($element.css('background-color') != 'rgb(0, 128, 0)')
    setButtonTrue(id)
  else
    setButtonFalse(id);
}

function setButton(id, state)
{
  if(state)
    setButtonTrue(id);
  else
    setButtonFalse(id);
}

function setButtonTrue(id)
{
  var $element = $('#' + id);
  $element.css('background-color', 'green');
  $element.children().removeClass('icon question circle outline').addClass('icon check');
  $element.children().css({color: 'white'});
}
function setButtonFalse(id)
{
  var $element = $('#' + id);
  $element.css('background-color', 'rgb(214,215,216)');
  $element.children().removeClass('icon check').addClass('icon question circle outline');
  $element.children().css({color:'gray'});
}

function toggleIcon(id)
{
  var $icon = $("#" + id);
  if($icon.attr('class') == 'icon check')
    setIconFalse(id);
  else
    setIconTrue(id);
}
function setIconTrue(id)
{
  var $icon = $("#" + id);
  if($icon.attr('class') != 'icon check')
    $icon.removeClass($icon.attr('class')).addClass('icon check');
}
function setIconFalse(id)
{
  var $icon = $("#" + id);
  if($icon.attr('class') != 'icon question circle outline')
    $icon.removeClass($icon.attr('class')).addClass('icon question circle outline');
}