window.onload = function() {
  const mathjaxLoaderElements = document.getElementsByClassName('filter_mathjaxloader_equation');
  let allText = '';

  for (let i = 0; i < mathjaxLoaderElements.length; i++) {
    const pTags = mathjaxLoaderElements[i].querySelectorAll('p');

    for (let j = 0; j < pTags.length; j++) {
      const textNodes = pTags[j].childNodes;

      for (let k = 0; k < textNodes.length; k++) {
        const node = textNodes[k];

        if (node.nodeType === Node.TEXT_NODE) {
          allText += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'SCRIPT') {
            allText += node.textContent;
          } else if (node.tagName === 'STRONG') {
            const strongText = node.textContent.trim();
            if (!strongText.startsWith('Figure ')) {
              allText += '\n\n' + strongText + '\n';
            } else {
              allText += strongText;
            }
          } else if (node.classList && node.classList.contains('nolink')) {
            const scriptTags = node.querySelectorAll('script');
            for (let l = 0; l < scriptTags.length; l++) {
              allText += scriptTags[l].textContent;
            }
          }
        }
      }
    }
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