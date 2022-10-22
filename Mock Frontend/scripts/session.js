function sessionEnabled()
{
  var checkbox = document.getElementById('session1');
  if (checkbox.checked)
  {
    console.log("turned on");
    getSensorsBySession('Session1')
  }
  else {
    document.getElementById("demo").innerHTML = ""
  }
}
function sessionEnabled2()
{
  var checkbox = document.getElementById('session2');
  if (checkbox.checked)
  {
    console.log("turned on");
    getSensorsBySession('Session2')
  }
  else {
    document.getElementById("demo").innerHTML = ""
  }
}
