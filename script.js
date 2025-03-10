function filterTools() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let tools = document.getElementsByClassName('tool');
    for (let i = 0; i < tools.length; i++) {
        let tool = tools[i];
        let text = tool.textContent.toLowerCase();
tool.style.display = text.includes(input) ? '' : 'none';
    }
}
 
function applyFilters() {
    let brand = document.getElementById('filterBrand').value.toLowerCase();
    let model = document.getElementById('filterModel').value.toLowerCase();
    let power = document.getElementById('filterPower').value.toLowerCase();
    let tools = document.getElementsByClassName('tool');
    for (let tool of tools) {
        let toolBrand = tool.getAttribute('data-brand').toLowerCase();
        let toolModel = tool.getAttribute('data-model').toLowerCase();
        let toolPower = tool.getAttribute('data-power').toLowerCase();
        if ((brand === '' || toolBrand === brand) &&
            (model === '' || toolModel === model) &&
            (power === '' || toolPower === power)) {
tool.style.display = '';
        } else {
tool.style.display = 'none';
        }
    }
}
 
function toggleDetails(id) {
    let details = document.getElementById(id);
details.style.display = details.style.display === 'none' ? 'block' : 'none';
}
 
function sendEmail(tool, startId, endId) {
    let startDate = document.getElementById(startId).value;
    let endDate = document.getElementById(endId).value;
 
    if (!startDate || !endDate) {
        alert("Please select both start and end dates!");
        return;
    }
 
    let subject = `Availability Request for ${tool}`;
    let body = `I would like to request the availability of ${tool} from ${startDate} to ${endDate}.`;
    window.location.href = `mailto:michael-06-1993@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}