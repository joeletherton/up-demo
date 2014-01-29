var contracting = false;
var expanding = false;

function expandFooter() {
    if (contracting) return;
    expanding = true;
    var actingDiv = $('#foot');
    var h = actingDiv.height();
    if (h >= 200) expanding = false;
    if (h < 200) {
        var newH = (h + 5 > 200) ? 200 : h + 5;
        actingDiv.height(newH);
        setTimeout(function () { expandFooter(); }, 20);
    }
}

function contractFooter() {
    if (expanding) return;
    contracting = true;
    var actingDiv = $('#foot');
    var h = actingDiv.height();
    if (h <= 45) contracting = false;
    if (h > 45) {
        var newH = (h - 5 < 45) ? 45 : h - 5;
        actingDiv.height(newH);
        setTimeout(function () { contractFooter(); }, 20);
    }
}

function startUp() {
    $("#foot").bind("mouseenter", expandFooter)
    $("#foot").bind("mouseleave", contractFooter);
}

window.onload = startUp;