const FIREBASE_HOSTING_URL = 'https://crm-extension.web.app';


document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded: popup.js");
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const userInfo = document.getElementById('userInfo');
    const container = document.querySelector('.popup-container');
    let loginFrame = null;
    let user = null;

    // Update UI based on user authentication state
    function updateUI(currentUser) {
        if (currentUser) {
            userInfo.textContent = `Signed in as: ${currentUser.email}`;
            signInButton.style.display = 'none';
            signOutButton.style.display = 'block';
            user = currentUser;
        } else {
            userInfo.textContent = 'Not signed in';
            signInButton.style.display = 'block';
            signOutButton.style.display = 'none';
            user = null;
        }
        console.log('UI updated with user:', currentUser);

    }

    // Fetch the user state from Chrome storage
    chrome.storage.local.get(['user'], function (result) {
                console.log('Stored user from chrome.storage:', result.user);

        updateUI(result.user);
    });

    // Sign-in button click handler
    signInButton.addEventListener('click', function () {
        console.log('Login button clicked');
        if (!loginFrame) {
            loginFrame = document.createElement('iframe');
            loginFrame.src = FIREBASE_HOSTING_URL;
            loginFrame.style.width = '100%';
            loginFrame.style.height = '300px';
            loginFrame.style.border = 'none';
            container.appendChild(loginFrame);
        }
        });

    window.addEventListener('message', (event) => {
        if (event.origin !== FIREBASE_HOSTING_URL) return;
        console.log('Message from iframe', event.data);
        try {
            const data = JSON.parse(event.data);
            if (data.user) {
                chrome.storage.local.set({ user: data.user });
                updateUI(data.user);
                if (loginFrame) {
                    container.removeChild(loginFrame);
                    loginFrame = null;
                }
            } else if (data.error) {
                console.error('Authentication failed:', data.error);
            }
 } catch (e) {
            console.error('Failed to parse message', e);
        }
    });

    // Sign-out button click handler
    signOutButton.addEventListener('click', function () {
        logoutUser();
    });

    function logoutUser() {
        chrome.storage.local.remove('user', () => {
            console.log("User logged out.");
        });
        updateUI(null);
    }

}); 
