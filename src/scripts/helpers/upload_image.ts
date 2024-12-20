require('dotenv').config()

export const upload_image = async function(image_src: string): Promise<string> {
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