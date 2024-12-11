var read_content = function () {
    var questions = document.getElementsByClassName("filter_mathjaxloader_equation");
    console.log(questions.length);
    var question_text = "";
    for (var i = 0; i < questions.length; i++) {
        for (var j = 0; j < questions[i].getElementsByTagName("p").length; j++) {
            var words = questions[i].getElementsByTagName("p")[j];
            for (var g = 0; g < words.childNodes.length; g++) {
                var child = words.childNodes[g];
                if (child.nodeType === Node.TEXT_NODE) {
                    question_text += child.nodeValue;
                    // console.log(words.childNodes[g].nodeValue)
                }
                else if (child.nodeType === Node.ELEMENT_NODE) {
                    if (child.childNodes.length > 0) {
                        for (var k = 0; k < child.childNodes.length; k++) {
                            if (child.childNodes[k].nodeName === "STRONG") {
                                question_text = question_text + "\\textbf{" + child.textContent + "}";
                            }
                        }
                    }
                    if (child.nodeName === "STRONG") {
                        question_text = question_text + "\\textbf{" + child.textContent + "}";
                    }
                    else if (child.nodeName === "IMG") {
                        // Todo: Upload image to imgur
                    }
                    else {
                        question_text = question_text + "\\(" + String(child.textContent) + "\\)";
                    }
                    console.log(child.nodeName);
                    // console.log(words.childNodes[g].textContent)
                }
            }
            // Adding 2 new line chars + latex new line char \\
            question_text = question_text + '\\\\\n\n';
        }
    }
    navigator.clipboard.writeText(question_text);
};
console.log("Script loaded");
window.onload = function () {
    read_content();
};
