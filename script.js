let košík = [];

function filtrovatNástroje() {
    let input = document.getElementById('vyhledávacíBar').value.toLowerCase();
    let nástroje = document.getElementsByClassName('nástroj');
    for (let i = 0; i < nástroje.length; i++) {
        let nástroj = nástroje[i];
        let text = nástroj.textContent.toLowerCase();
        nástroj.style.display = text.includes(input) ? '' : 'none';
    }
}

function aplikovatFiltrKategorie() {
    let kategorie = document.getElementById('filtrKategorie').value.toLowerCase();
    let nástroje = document.getElementsByClassName('nástroj');
    for (let nástroj of nástroje) {
        let nástrojKategorie = nástroj.getAttribute('data-category').toLowerCase();
        nástroj.style.display = (kategorie === 'vše' || nástrojKategorie === kategorie) ? '' : 'none';
    }
}

function přepnoutDetaily(id) {
    let detaily = document.getElementById(id);
    detaily.style.display = detaily.style.display === 'none' ? 'block' : 'none';
}

function přidatDoKošíku(button) {
    let nástroj = button.closest('.nástroj').querySelector('.tool').textContent;
    let startDatum = button.closest('.kalendář').querySelector('[id^="startDatum"]').value;
    let endDatum = button.closest('.kalendář').querySelector('[id^="endDatum"]').value;
    let halfDay = button.closest('.kalendář').querySelector('[id^="halfDay"]').checked;

    if (!startDatum || !endDatum) {
        alert("Prosím vyberte obě data začátku a konce!");
        return;
    }

    košík.push({ nástroj, startDatum, endDatum, halfDay });
    alert(`${nástroj} přidán do košíku!`);
}

function odeslatEmailKošík() {
    if (košík.length === 0) {
        alert("Váš košík je prázdný!");
        return;
    }

    let předmět = "Požadavek na dostupnost více nástrojů";
    let tělo = "Rád bych požádal o dostupnost následujících nástrojů:\n\n";
    košík.forEach(item => {
        tělo += `${item.nástroj} od ${item.startDatum} do ${item.endDatum}`;
        if (item.halfDay) {
            tělo += " (pouze půl dne)";
        }
        tělo += "\n";
    });

    window.location.href = `mailto:michael-06-1993@hotmail.com?subject=${encodeURIComponent(předmět)}&body=${encodeURIComponent(tělo)}`;
}
