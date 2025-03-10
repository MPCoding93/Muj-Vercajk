let košík = JSON.parse(localStorage.getItem('košík')) || [];

function filtrovatNástroje() {
    let input = document.getElementById('vyhledávacíBar').value.toLowerCase();
    let nástroje = document.getElementsByClassName('nástroj');
    for (let i = 0; i < nástroje.length; i++) {
        let nástroj = nástroje[i];
        let text = nástroj.textContent.toLowerCase();
        nástroj.style.display = text.includes(input) ? '' : 'none';
    }
}

function aplikovatFiltrKategorie(kategorie) {
    console.log("Selected category: " + kategorie);
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
    let image = button.closest('.nástroj').querySelector('img').src;

    if (!startDatum || !endDatum) {
        alert("Prosím vyberte obě data začátku a konce!");
        return;
    }

    košík.push({ nástroj, startDatum, endDatum, image });
    localStorage.setItem('košík', JSON.stringify(košík));
    updateCartCount();
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = košík.length;
}

function odeslatEmailKošík() {
    if (košík.length === 0) {
        alert("Váš košík je prázdný!");
        return;
    }

    let předmět = "Požadavek na dostupnost více nástrojů";
    let tělo = "Rád bych požádal o dostupnost následujících nástrojů:\n\n";
    košík.forEach(item => {
        tělo += `${item.nástroj} od ${item.startDatum} do ${item.endDatum}\n`;
    });

    window.location.href = `mailto:michael-06-1993@hotmail.com?subject=${encodeURIComponent(předmět)}&body=${encodeURIComponent(tělo)}`;

    // Save previous requests
    let previousRequests = JSON.parse(localStorage.getItem('previousRequests')) || [];
    let orderDate = new Date().toLocaleString(); // Include date and time
    košík.forEach(item => {
        previousRequests.push({ orderDate, ...item });
    });
    localStorage.setItem('previousRequests', JSON.stringify(previousRequests));

    // Clear the cart after sending the email and return to the home page
    košík = [];
    localStorage.setItem('košík', JSON.stringify(košík));
    updateCartCount();
    window.location.href = 'index.html';
}

function returnToMainPage() {
    window.location.href = 'index.html';
}

// Add event listener to cart icon
document.querySelector('.cart-icon').addEventListener('click', () => {
    window.location.href = 'cart-summary.html';
});

// Update cart count on page load
updateCartCount();
