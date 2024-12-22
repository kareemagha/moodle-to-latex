export const downlaod_image = function(url: string, filename: string) {
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