const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';
const FIREBASE_HOSTING_URL = 'https://crm-extension.web.app';
console.log('Background script loaded');

let creatingOffscreenDocument;

async function hasOffscreenDocument() {
    const matchedClients = await clients.matchAll();
    return matchedClients.some((client) => client.url.endsWith(OFFSCREEN_DOCUMENT_PATH));
}

async function setupOffscreenDocument() {
    if (await hasOffscreenDocument()) {
        console.log('Offscreen document already exists');
        return;
    }

    if (creatingOffscreenDocument) {
        await creatingOffscreenDocument;
    } else {
        creatingOffscreenDocument = chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
            justification: 'Firebase Authentication'
        });
        await creatingOffscreenDocument;
        creatingOffscreenDocument = null;
    }
}

async function getAuthFromOffscreen(email, password) {
    console.log('Requesting auth from offscreen');

    await setupOffscreenDocument();
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'getAuth', target: 'offscreen', email, password }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message', message);

    if (message.action === 'signIn') {
        getAuthFromOffscreen(message.email, message.password)

            .then(user => {
                chrome.storage.local.set({ user: user }, () => {
                    sendResponse({ user: user });
                });
            })
            .catch(error => {
                console.error('Authentication error:', error);
                sendResponse({ error: error.message });
            });
        return true; // Indicates we will send a response asynchronously
    } else if (message.action === 'signOut') {
        console.log('Signing out');

        chrome.storage.local.remove('user', () => {
            sendResponse();
        });
        return true;
    }
});