let košík = JSON.parse(localStorage.getItem('košík')) || [];

function displayCartItems() {
    let cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    košík.forEach((item, index) => {
        let row = document.createElement('tr');

        let imgCell = document.createElement('td');
        let img = document.createElement('img');
        img.src = item.image;
        img.className = 'cart-item-image';
        imgCell.appendChild(img);
        row.appendChild(imgCell);

        let nameCell = document.createElement('td');
        nameCell.textContent = item.nástroj;
        row.appendChild(nameCell);

        let startDateCell = document.createElement('td');
        startDateCell.textContent = item.startDatum;
        row.appendChild(startDateCell);

        let endDateCell = document.createElement('td');
        endDateCell.textContent = item.endDatum;
        row.appendChild(endDateCell);

        let actionCell = document.createElement('td');
        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeCartItem(index);
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);

        cartItemsContainer.appendChild(row);
    });
}

function removeCartItem(index) {
    košík.splice(index, 1);
    localStorage.setItem('košík', JSON.stringify(košík));
    displayCartItems();
}

function returnToMainPage() {
    window.location.href = 'index.html';
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

displayCartItems();
