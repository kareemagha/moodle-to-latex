window.onload = function() {
  const mathjaxLoaderElements = document.getElementsByClassName('filter_mathjaxloader_equation');
  let allText = '\\subsection{ } \\\\ \n ';
  let imageCounter = 1;  // Initialize an image counter

  for (let i = 0; i < mathjaxLoaderElements.length; i++) {
    const pTags = mathjaxLoaderElements[i].querySelectorAll('p');

    for (let j = 0; j < pTags.length; j++) {
      const textNodes = pTags[j].childNodes;

      for (let k = 0; k < textNodes.length; k++) {
        const node = textNodes[k];

        if (node.nodeType === Node.TEXT_NODE) {
          // Add bold question mark after every '=' sign
          allText += node.textContent.replace(/=/g, '=\\textbf{?}');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'SCRIPT') {
            let scriptContent = node.textContent;
            // Check if it's a MathJax script or a math/tex script
            if (node.type === 'math/tex') {
              // Add new lines before and after the script content, and make it bold
              allText += `\n\\textbf{$${scriptContent}$}\n`;
            } else {
              // For MathJax script: Add bold question mark after every '=' sign
              scriptContent = scriptContent.replace(/=/g, '=\\textbf{?}');
              // Add a newline before the '$$' only if there's an '=' in the content
              if (scriptContent.includes('=')) {
                allText += `\n$${scriptContent}$`;
              } else {
                allText += `$${scriptContent}$`;
              }
            }
          } else if (node.tagName === 'STRONG') {
            const strongText = node.textContent.trim();
             if (!strongText.startsWith('Figure ' || 'Part ')) {
              allText += `\\\\` + '\n\n' + `\\textbf{`+ strongText + `}` + '\n';
            } else {
              allText += strongText;
            }
          } else if (node.tagName === 'IMG') {
            // Download the image with the current Unix timestamp and a counter as the filename
            const timestamp = Date.now().toString();
            const filename = `${timestamp}_${imageCounter}`;
            downloadImage(node.src, filename);
            // Add the image reference to the text, with spaces before and after, centered
            allText += `\n\n\\begin{center}\n\\includegraphics[width=0.8\\textwidth]{images/${filename}.png}\n\\end{center}\n\n`;
            imageCounter++;  // Increment the image counter
          } else if (node.tagName === 'INPUT' && node.type === 'text') {
            // Replace input type='text' with three bold question marks
            allText += '\\textbf{???}';
          } else if (node.classList.contains('nolink')) {
            const scriptTags = node.querySelectorAll('script');
            for (let l = 0; l < scriptTags.length; l++) {
              let scriptContent = scriptTags[l].textContent;
              // Add a newline before the '$$' only if there's an '=' in the content
              if (scriptContent.includes('=')) {
                allText += `\\\\ \n\n$${scriptContent}$`;
              } else {
                allText += `$${scriptContent}$`;
              }
            }
          }
        }
      }
    }

    allText += `\\\\ \\newpage \n\n`

  }

  // Copy all text to clipboard
  navigator.clipboard.writeText(allText)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
    });
};

// Function to download an image
function downloadImage(url, filename) {
  // Ensure the filename ends with .png
  if (!filename.endsWith('.png')) {
    filename += '.png';
  }

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
