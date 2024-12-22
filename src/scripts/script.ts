import { upload_image } from "./helpers/upload_image.js"
import { downlaod_image } from "./helpers/download_image.js"
import { saveText } from "./helpers/save_text.js";

interface ReturnedObject {
    questionText: string;
    imageCounter: number;
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
                if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim() !== "") {
                    question_text += child.nodeValue
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    let recSerObj = recursiveSearch(child, question_text, image_counter, 0)
                    question_text = recSerObj.questionText
                    image_counter = recSerObj.imageCounter
                    console.log(child.nodeName)
                }
            }
            // Adding 2 new line chars + latex new line char \\
            if (question_text.slice(-1) != "\n") {
                question_text = question_text + '\\\\\n\n'
            }
        }
    }
    navigator.clipboard.writeText(question_text)
} 


const recursiveSearch = function recSer(child: ChildNode, question_text: string, image_counter: number, depth: number) {
    if (child.nodeName === "STRONG" && child.textContent != "") {
        question_text = question_text + "\\textbf{" + child.textContent + "}"
    } else if (child.nodeName === "IMG") {
        const img_element = child as HTMLImageElement;
        const image_src = img_element.src;
        if (child instanceof Element && !child.classList.contains('texrender')) {
            let file_name = `${Date.now()}_${image_counter}`;
            downlaod_image(image_src, file_name);
            question_text = question_text + `\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${file_name}.png}\n\\end{center}`;
            image_counter++;
        }
    } else if (child.nodeName === "INPUT") {
        question_text = question_text + " \\underline{\\hspace{3cm}} "
    } else if (depth < 1) {
        if (saveText(String(child.textContent?.trim())) === true) {
            question_text = question_text + "$" + String(child.textContent) + "$"
        }
    }

    let returnObject: ReturnedObject = {
        questionText: question_text,
        imageCounter: image_counter,
    }
    
    if (child.childNodes.length > 0) {
        for(let i = 0; i < child.childNodes.length; i++) {
            let returnedObject_1 = recSer(child.childNodes[i], question_text, image_counter, depth + 1)
            image_counter = returnedObject_1.imageCounter
            question_text = returnedObject_1.questionText
        }
        returnObject.questionText = question_text
        returnObject.imageCounter = image_counter
    }

    return returnObject
}

console.log("Script loaded");
read_content()
