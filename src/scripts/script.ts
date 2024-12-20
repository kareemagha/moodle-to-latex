require('dotenv').config()

const read_content = async function() {
    const questions = document.getElementsByClassName("filter_mathjaxloader_equation")
    console.log(questions.length)
    let image_counter = 0
    let question_text = ""
    for (let i = 0; i < questions.length; i++) {
        for (let j = 0; j < questions[i].getElementsByTagName("p").length; j++) {
            const words = questions[i].getElementsByTagName("p")[j]
            for(let g = 0; g < words.childNodes.length; g++) {
                let child = words.childNodes[g]
                if (child.nodeType === Node.TEXT_NODE) {
                    question_text += child.nodeValue
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    let flag = 0
                    if(child.childNodes.length > 0) {
                        for (let k = 0; k < child.childNodes.length; k++) {
                            if (child.childNodes[k].nodeName === "STRONG") {
                                question_text = question_text + "\\textbf{" + child.textContent + "}"
                                flag = 1
                            }
                            if (child.childNodes[0].nodeName === "IMG") {
                                const img_element = child.childNodes[0] as HTMLImageElement;
                                const image_src = img_element.src;
                                let file_name = `${Date.now()}_${image_counter}`
                                downlaod_image(image_src, file_name);
                                question_text = question_text + `\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${file_name}.png}\n\\end{center}`
                                image_counter++;
                                flag = 1
                            }
                        }
                    }
                    if (flag === 0) {
                        if (child.nodeName === "STRONG") {
                            question_text = question_text + "\\textbf{" + child.textContent + "}"
                        } else if (child.nodeName === "IMG") {
                            const img_element = child as HTMLImageElement;
                            const image_src = img_element.src;
                            let file_name = `${Date.now()}_${image_counter}`
                            downlaod_image(image_src, file_name);
                            question_text = question_text + `\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${file_name}.png}\n\\end{center}`
                            image_counter++;
                        } else if (child.nodeName === "INPUT") {
                            question_text = question_text + " \\underline{\\hspace{3cm}} "
                        } else {
                            question_text = question_text + "$" + String(child.textContent) + "$"
                        }
                        console.log(child.nodeName)
                    }
                }
            }
            // Adding 2 new line chars + latex new line char \\
            question_text = question_text + '\\\\\n\n'
        }
    }
    navigator.clipboard.writeText(question_text)
} 


const upload_image = async function(image_src: string): Promise<string> {
    try {
        const res = await fetch(image_src);
        const myBlob = await res.blob();
        
        const image_file = new File([myBlob], 'image.jpeg', {type: myBlob.type});
        const formData = new FormData();
        formData.append('image', image_file);
        formData.append('album', `${process.env.DELETE_HASH}`);
        
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: new Headers({
                Authorization: `Client-ID ${process.env.CLIENT_ID}`
            }),
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const imageUrl = data.data.link;
        console.log('Image uploaded to album! Link: ' + imageUrl);
        return imageUrl;
    } catch (error) {
        console.error(JSON.stringify(error));
        console.log('Upload failed: ');
        throw error;
    }
}


const downlaod_image = function(url: string, filename: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function() {
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
    } else {
      console.error('Failed to download image:', url);
    }
  };

  xhr.onerror = function() {
    console.error('Error downloading image:', url);
  };

  xhr.send();
}


console.log("Script loaded");
window.onload = () => {
    read_content()
}