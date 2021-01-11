/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

/**
 * Pop up modal if error
 * @param {string} title 
 * @param {string} msg 
 */
export function popupModal (title, msg) {
    const modal = document.getElementById('err-modal');
    modal.style.display = 'flex';
    const titleText = document.createTextNode(title);
    const titleDiv = document.getElementById('modal-title-text');
    if (titleDiv.hasChildNodes()) titleDiv.removeChild(titleDiv.childNodes[0]);
    titleDiv.appendChild(titleText);
    const msgText = document.createTextNode(msg);
    const msgDiv = document.getElementById('modal-body-msg');
    if (msgDiv.hasChildNodes()) msgDiv.removeChild(msgDiv.childNodes[0]);
    msgDiv.appendChild(msgText);

    /** Close modal */
    document.getElementById('close-modal').addEventListener('click', event => modal.style.display = 'none');
    document.getElementById('cross-btn').addEventListener('click', event => modal.style.display = 'none');
}