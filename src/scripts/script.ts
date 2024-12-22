import { upload_image } from "./helpers/upload_image.js"
import { downlaod_image } from "./helpers/download_image.js"

interface ReturnedObject {
    question_text: string;
    image_counter: number;
}

const read_content = function() {
    const questions = document.getElementsByClassName("filter_mathjaxloader_equation")
    console.log(questions.length)
    let image_counter = 0
    let question_text = ""

    // search through all questions
    for (let i = 0; i < questions.length; i++) {
        // search through all question elements i.e. text, images, latex...
        for (let j = 0; j < questions[i].getElementsByTagName("p").length; j++) {
            const words = questions[i].getElementsByTagName("p")[j]
            for(let g = 0; g < words.childNodes.length; g++) {
                let child = words.childNodes[g]
                if (child.nodeType === Node.TEXT_NODE) {
                    question_text += child.nodeValue
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    let recSerObj = recursiveSearch(child, question_text, image_counter)
                    question_text = recSerObj.question_text
                    image_counter = recSerObj.image_counter
                    console.log(child.nodeName)
                }
            }
            // Adding 2 new line chars + latex new line char \\
            question_text = question_text + '\\\\\n\n'
        }
    }
    navigator.clipboard.writeText(question_text)
} 


const recursiveSearch = function recSer(child: ChildNode, question_text: string, image_counter: number) {
    if (child.nodeName === "STRONG") {
        question_text = question_text + "\\textbf{" + child.textContent + "}"
    } else if (child.nodeName === "IMG") {
        const img_element = child as HTMLImageElement;
        const image_src = img_element.src;

        // Check the image size before downloading
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', image_src, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const contentLength = parseInt(xhr.getResponseHeader('Content-Length') || '0', 10);
                // Skip images smaller than 2 KB
                if (contentLength > 2048) { // 2048 bytes = 2 KB
                    let file_name = `${Date.now()}_${image_counter}`;
                    downlaod_image(image_src, file_name);
                    question_text = question_text + `\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${file_name}.png}\n\\end{center}`;
                    image_counter++;
                }
            }
        };
        xhr.send();
    } else if (child.nodeName === "INPUT") {
        question_text = question_text + " \\underline{\\hspace{3cm}} "
    } else {
        question_text = question_text + "$" + String(child.textContent) + "$"
    }

    let returnObject: ReturnedObject = {
        question_text,
        image_counter,
    }
    
    if (child.childNodes.length > 0) {
        for(let i = 0; i < child.childNodes.length; i++) {
            let returnedObject = recSer(child.childNodes[i], question_text, image_counter)
            image_counter = returnedObject.image_counter
            question_text = returnedObject.question_text
        }
    }

    return returnObject
}


console.log("Script loaded");
read_content()
