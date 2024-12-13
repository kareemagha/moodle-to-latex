var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var read_content = function () {
    return __awaiter(this, void 0, void 0, function () {
        var questions, image_counter, question_text, i, j, words, g, child, flag, k, img_element, image_src, file_name, img_element, image_src, file_name;
        return __generator(this, function (_a) {
            questions = document.getElementsByClassName("filter_mathjaxloader_equation");
            console.log(questions.length);
            image_counter = 0;
            question_text = "";
            for (i = 0; i < questions.length; i++) {
                for (j = 0; j < questions[i].getElementsByTagName("p").length; j++) {
                    words = questions[i].getElementsByTagName("p")[j];
                    for (g = 0; g < words.childNodes.length; g++) {
                        child = words.childNodes[g];
                        if (child.nodeType === Node.TEXT_NODE) {
                            question_text += child.nodeValue;
                            // console.log(words.childNodes[g].nodeValue)
                        }
                        else if (child.nodeType === Node.ELEMENT_NODE) {
                            flag = 0;
                            if (child.childNodes.length > 0) {
                                for (k = 0; k < child.childNodes.length; k++) {
                                    if (child.childNodes[k].nodeName === "STRONG") {
                                        question_text = question_text + "\\textbf{" + child.textContent + "}";
                                        flag = 1;
                                    }
                                    if (child.childNodes[0].nodeName === "IMG") {
                                        img_element = child.childNodes[0];
                                        image_src = img_element.src;
                                        file_name = "".concat(Date.now(), "_").concat(image_counter);
                                        downlaod_image(image_src, file_name);
                                        question_text = question_text + "\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/".concat(file_name, ".png}\n\\end{center}");
                                        image_counter++;
                                        flag = 1;
                                    }
                                }
                            }
                            if (flag === 0) {
                                if (child.nodeName === "STRONG") {
                                    question_text = question_text + "\\textbf{" + child.textContent + "}";
                                }
                                else if (child.nodeName === "IMG") {
                                    img_element = child;
                                    image_src = img_element.src;
                                    file_name = "".concat(Date.now(), "_").concat(image_counter);
                                    downlaod_image(image_src, file_name);
                                    question_text = question_text + "\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/".concat(file_name, ".png}\n\\end{center}");
                                    image_counter++;
                                }
                                else if (child.nodeName === "INPUT") {
                                    question_text = question_text + " \\underline{\\hspace{3cm}} ";
                                }
                                else {
                                    question_text = question_text + "$" + String(child.textContent) + "$";
                                }
                                console.log(child.nodeName);
                                // console.log(words.childNodes[g].textContent)
                            }
                        }
                    }
                    // Adding 2 new line chars + latex new line char \\
                    question_text = question_text + '\\\\\n\n';
                }
            }
            navigator.clipboard.writeText(question_text);
            return [2 /*return*/];
        });
    });
};
var upload_image = function (image_src) {
    return __awaiter(this, void 0, void 0, function () {
        var res, myBlob, image_file, formData, response, data, imageUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch(image_src)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.blob()];
                case 2:
                    myBlob = _a.sent();
                    image_file = new File([myBlob], 'image.jpeg', { type: myBlob.type });
                    formData = new FormData();
                    formData.append('image', image_file);
                    formData.append('album', 'sCphDeIvLyBalP0');
                    return [4 /*yield*/, fetch('https://api.imgur.com/3/image', {
                            method: 'POST',
                            headers: new Headers({
                                Authorization: 'Client-ID ff11469576d6967'
                            }),
                            body: formData
                        })];
                case 3:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    imageUrl = data.data.link;
                    console.log('Image uploaded to album! Link: ' + imageUrl);
                    return [2 /*return*/, imageUrl];
                case 5:
                    error_1 = _a.sent();
                    console.error(JSON.stringify(error_1));
                    console.log('Upload failed: ');
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
};
var downlaod_image = function (url, filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (this.status === 200) {
            var blob = this.response;
            var a = document.createElement('a');
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
console.log("Script loaded");
window.onload = function () {
    read_content();
};
