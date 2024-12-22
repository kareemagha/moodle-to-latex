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
    const ignoreList = ["Question:", "", " "];
    if (ignoreList.includes(input_text)) {
        return false;
    }
    return true;
};

const read_content = function () {
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
                    let recSerObj = recursiveSearch(child, question_text, image_counter, 0);
                    question_text = recSerObj.questionText;
                    image_counter = recSerObj.imageCounter;
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
};
const recursiveSearch = function recSer(child, question_text, image_counter, depth) {
    var _a;
    if (child.nodeName === "STRONG" && child.textContent != "") {
        question_text = question_text + "\\textbf{" + child.textContent + "}";
    }
    else if (child.nodeName === "IMG") {
        const img_element = child;
        const image_src = img_element.src;
        if (child instanceof Element && !child.classList.contains('texrender')) {
            let file_name = `${Date.now()}_${image_counter}`;
            downlaod_image(image_src, file_name);
            question_text = question_text + `\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${file_name}.png}\n\\end{center}`;
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
            let returnedObject_1 = recSer(child.childNodes[i], question_text, image_counter, depth + 1);
            image_counter = returnedObject_1.imageCounter;
            question_text = returnedObject_1.questionText;
        }
        returnObject.questionText = question_text;
        returnObject.imageCounter = image_counter;
    }
    return returnObject;
};
console.log("Script loaded");
read_content();
