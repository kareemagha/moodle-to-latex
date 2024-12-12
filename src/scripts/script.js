var read_content = function () {
    var questions = document.getElementsByClassName("filter_mathjaxloader_equation");
    console.log(questions.length);
    var question_text = "";
    // Loop through question boxes
    for (var i = 0; i < questions.length; i++) {
        // Loop through <p> in question box
        for (var j = 0; j < questions[i].getElementsByTagName("p").length; j++) {
            var depth = 0;
            var words = questions[i].getElementsByTagName("p")[j];
            question_text = recursive_search(question_text, words);
            // Adding 2 new line chars + latex new line char \\
            question_text = question_text + '\\\\\n\n';
        }
    }
    navigator.clipboard.writeText(question_text);
};
var recursive_search = function (question_text, words) {
    for (var g = 0; g < words.childNodes.length; g++) {
        var child = words.childNodes[g];
        if (child.nodeType === Node.TEXT_NODE) {
            question_text += child.nodeValue;
        }
        else if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.childNodes.length > 2) {
                question_text = recursive_search(question_text, words);
            }
            else {
                if (child.nodeName === "STRONG") {
                    question_text = question_text + "\\textbf{" + child.textContent + "}";
                }
                else if (child.nodeName === "IMG") {
                    // Todo: Upload image to imgur
                }
                else {
                    question_text = question_text + "\\(" + String(child.textContent) + "\\)";
                }
            }
        }
    }
    return question_text;
};
console.log("Script loaded");
window.onload = function () {
    read_content();
};
