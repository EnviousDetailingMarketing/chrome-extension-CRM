const FIREBASE_HOSTING_URL = 'https://crm-extension.web.app';

const iframe = document.createElement('iframe');
iframe.src = FIREBASE_HOSTING_URL;
document.body.appendChild(iframe);
console.log('Offscreen document initialized');


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getAuth' && message.target === 'offscreen') {
        console.log('Received getAuth message', message);

        function handleIframeMessage({ data }) {
            try {
                const parsedData = JSON.parse(data);
                window.removeEventListener('message', handleIframeMessage);
                sendResponse(parsedData.user);
            } catch (e) {
                console.error('Error parsing iframe message:', e);
            }
        }

        window.addEventListener('message', handleIframeMessage);
        iframe.contentWindow.postMessage({
            initAuth: true,
            email: message.email,
            password: message.password
        }, FIREBASE_HOSTING_URL);
        return true; // Indicates we will send a response asynchronously //change
    }
});
