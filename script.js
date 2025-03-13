let košík = JSON.parse(localStorage.getItem('košík')) || [];

// Function to filter tools
function filtrovatNástroje() {
    let input = document.getElementById('vyhledávacíBar').value.toLowerCase();
    let nástroje = document.getElementsByClassName('nástroj');
    for (let i = 0; i < nástroje.length; i++) {
        let nástroj = nástroje[i];
        let text = nástroj.textContent.toLowerCase();
        nástroj.style.display = text.includes(input) ? '' : 'none';
    }
}

// Function to apply category filter
function aplikovatFiltrKategorie(kategorie) {
    console.log("Selected category: " + kategorie);
    let nástroje = document.getElementsByClassName('nástroj');
    for (let nástroj of nástroje) {
        let nástrojKategorie = nástroj.getAttribute('data-category').toLowerCase().split(',');
        nástroj.style.display = (kategorie === 'vše' || nástrojKategorie.includes(kategorie)) ? '' : 'none';
    }
    // Remove active class from all filters
    let filters = document.querySelectorAll('#filtrKategorie a');
    filters.forEach(filter => filter.classList.remove('active'));
    // Add active class to the selected filter
    let selectedFilter = document.querySelector(`#filtrKategorie a[onclick*="aplikovatFiltrKategorie('${kategorie}')"]`);
    if (selectedFilter) {
        selectedFilter.classList.add('active');
    }
}

// Function to toggle tool details
function přepnoutDetaily(id) {
    let detaily = document.getElementById(id);
    detaily.style.display = detaily.style.display === 'none' ? 'block' : 'none';
}

// Function to add tool to cart
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

// Function to update cart count
function updateCartCount() {
    document.getElementById('cart-count').textContent = košík.length;
}

// Function to send cart items via email
function odeslatEmailKošík() {
    if (košík.length === 0) {
        alert("Váš košík je prázdný!");
        return;
    }
    let předmět = "Požadavek na dostupnost více nástrojů";
    let tělo = "Rád bych požádal o dostupnost následujících nástrojů:\\n\\n";
    košík.forEach(item => {
        tělo += `${item.nástroj} od ${item.startDatum} do ${item.endDatum}\\n`;
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

// Function to return to the main page
function returnToMainPage() {
    window.location.href = 'index.html';
}

// Add event listener to cart icon
document.querySelector('.cart-icon').addEventListener('click', () => {
    window.location.href = 'cart-summary.html';
});

// Update cart count on page load
updateCartCount();

// Function to show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    openTab(null, 'Login'); // Default to Login tab
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to open tab
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('mtabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
        tabcontent[i].classList.remove('active');
    }
    const tablinks = document.getElementsByClassName('mtablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    document.getElementById(tabName).style.display = 'block';
    document.getElementById(tabName).classList.add('active');
    if (evt) {
        evt.currentTarget.classList.add('active');
    }
}

// Function to register user
async function registerUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const registerFeedback = document.getElementById('registerFeedback');

    if (firstName && lastName && email && password) {
        const userName = `${firstName.charAt(0)}${lastName}`.toLowerCase();
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, firstName, lastName, email, password })
        });

        if (response.ok) {
            registerFeedback.textContent = 'Registration successful!';
            registerFeedback.style.color = 'green';
            closeModal('authModal');
        } else {
            registerFeedback.textContent = 'Registration failed!';
            registerFeedback.style.color = 'red';
        }
    } else {
        registerFeedback.textContent = 'Please fill in all mandatory fields!';
        registerFeedback.style.color = 'red';
    }
}

// Function to login user
async function loginUser() {
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginFeedback = document.getElementById('loginFeedback');

    if (userName && password) {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, password })
        });

        if (response.ok) {
            loginFeedback.textContent = 'Login successful!';
            loginFeedback.style.color = 'green';
            closeModal('authModal');
        } else {
            loginFeedback.textContent = 'Invalid credentials!';
            loginFeedback.style.color = 'red';
        }
    } else {
        loginFeedback.textContent = 'Please fill in both fields!';
        loginFeedback.style.color = 'red';
    }
}

// Function to update user data
function updateUserData(userName, newData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.userName === userName);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...newData };
        localStorage.setItem('users', JSON.stringify(users));
    }
}

async function pushDataToGitHub(data, filePath) {
    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`;
    const content = btoa(JSON.stringify(data)); // Encode data to base64
    console.log('Pushing data to GitHub:', data); // Debugging statement
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update data',
        content: content,
        sha: await getFileSha(url, process.env.GITHUB_TOKEN) // Get the SHA of the existing file
      })
    });
    if (response.ok) {
      console.log('Data pushed to GitHub successfully');
    } else {
      console.error('Failed to push data to GitHub', response.statusText);
    }
  }
  
  // Function to get file SHA from GitHub
  async function getFileSha(url, token) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.sha;
    } else {
      return null;
    }
  }
  
  // Function to retrieve data from GitHub
  async function retrieveDataFromGitHub(filePath) {
    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      const content = atob(data.content); // Decode base64 content
      return JSON.parse(content);
    } else {
      console.error('Failed to retrieve data from GitHub', response.statusText);
      return [];
    }
  }
