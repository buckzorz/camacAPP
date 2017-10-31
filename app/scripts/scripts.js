function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("header").style.marginLeft= "250px";
    document.getElementById("main").style.marginLeft= "250px";
    document.getElementById("footer").style.marginLeft= "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("header").style.marginLeft= "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("footer").style.marginLeft= "0";
}


function showContent() {
  document.getElementById("loader").style.display = "inline";
  document.getElementById("main-info").style.display = "inline";
  document.getElementById("main-info").style.className += "main-info-animate";
}