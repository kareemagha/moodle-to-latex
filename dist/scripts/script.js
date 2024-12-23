/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const upload_image = function (image_src, clientId, deleteHash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(image_src);
            const myBlob = yield res.blob();
            const image_file = new File([myBlob], 'image.jpeg', { type: myBlob.type });
            const formData = new FormData();
            formData.append('image', image_file);
            formData.append('album', `${deleteHash}`);
            const response = yield fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: new Headers({
                    Authorization: `Client-ID ${clientId}`
                }),
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = yield response.json();
            const imageUrl = data.data.link;
            console.log('Image uploaded to album! Link: ' + imageUrl);
            return imageUrl;
        }
        catch (error) {
            console.error(JSON.stringify(error));
            console.log('Upload failed: ');
            throw error;
        }
    });
};

const downlaod_image = function (url, filename) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (this.status === 200) {
            const blob = this.response;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }
        else {
            console.error('Failed to download image:', url);
        }
    };
    xhr.onerror = function () {
        console.error('Error downloading image:', url);
    };
    xhr.send();
};

const saveText = function (input_text) {
    const ignoreList = ["Question:", ""];
    if (ignoreList.includes(input_text)) {
        return false;
    }
    return true;
};

const read_content = function (imageOption, clientId, deleteHash) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const questions = document.getElementsByClassName("filter_mathjaxloader_equation");
        console.log(questions.length);
        let image_counter = 0;
        let question_text = "";
        // search through all questions
        for (let i = 0; i < questions.length; i++) {
            // search through all question elements i.e. text, images, latex...
            for (let j = 0; j < questions[i].getElementsByTagName("p").length; j++) {
                const words = questions[i].getElementsByTagName("p")[j];
                for (let g = 0; g < words.childNodes.length; g++) {
                    let child = words.childNodes[g];
                    if (child.nodeType === Node.TEXT_NODE && ((_a = child.nodeValue) === null || _a === void 0 ? void 0 : _a.trim()) !== "") {
                        question_text += child.nodeValue;
                    }
                    else if (child.nodeType === Node.ELEMENT_NODE) {
                        let recSerObj = recursiveSearch(child, question_text, image_counter, 0, imageOption, clientId, deleteHash);
                        question_text = (yield recSerObj).questionText;
                        image_counter = (yield recSerObj).imageCounter;
                        console.log(child.nodeName);
                    }
                }
                // Adding 2 new line chars + latex new line char \\
                if (question_text.slice(-1) != "\n") {
                    question_text = question_text + '\\\\\n\n';
                }
            }
        }
        navigator.clipboard.writeText(question_text);
    });
};
const recursiveSearch = function recSer(child, question_text, image_counter, depth, imageOption, clientId, deleteHash) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (child.nodeName === "STRONG" && child.textContent != "") {
            question_text = question_text + "\\textbf{" + child.textContent + "}";
        }
        else if (child.nodeName === "IMG") {
            const img_element = child;
            const image_src = img_element.src;
            if (child instanceof Element && !child.classList.contains('texrender')) {
                let file_name = `${Date.now()}_${image_counter}`;
                if (imageOption === "download") {
                    downlaod_image(image_src, file_name);
                    question_text = question_text + `\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${file_name}.png}\n\\end{center}`;
                }
                else if (imageOption === "upload") {
                    let imageURL = yield upload_image(image_src, clientId, deleteHash);
                    console.log(imageURL);
                    question_text = question_text + `\\immediate\\write18{curl -o ${file_name}.png ${imageURL}}\n\\begin{center}\n\t\\includegraphics[width=0.8\\textwidth]{${file_name}.png}\n\\end{center}`;
                }
                image_counter++;
            }
        }
        else if (child.nodeName === "INPUT") {
            question_text = question_text + " \\underline{\\hspace{3cm}} ";
        }
        else if (depth < 1) {
            if (saveText(String((_a = child.textContent) === null || _a === void 0 ? void 0 : _a.trim())) === true) {
                question_text = question_text + "$" + String(child.textContent) + "$";
            }
        }
        let returnObject = {
            questionText: question_text,
            imageCounter: image_counter,
        };
        if (child.childNodes.length > 0) {
            for (let i = 0; i < child.childNodes.length; i++) {
                let returnedObject_1 = recSer(child.childNodes[i], question_text, image_counter, depth + 1, imageOption, clientId, deleteHash);
                image_counter = (yield returnedObject_1).imageCounter;
                question_text = (yield returnedObject_1).questionText;
            }
            returnObject.questionText = question_text;
            returnObject.imageCounter = image_counter;
        }
        return returnObject;
    });
};
console.log("Script loaded");
(function () {
    chrome.storage.sync.get(['imageOption', 'deleteHash', 'clientId', 'extensionState'], (items) => {
        const imageOption = items.imageOption;
        const deleteHash = items.deleteHash;
        const clientId = items.clientId;
        const extensionState = items.extensionState;
        console.log('Image Option:', imageOption);
        console.log('Delete Hash:', deleteHash);
        console.log('Client ID:', clientId);
        console.log('Extension State:', extensionState);
        if (extensionState === "on") {
            read_content(imageOption, deleteHash, clientId);
        }
    });
})();
