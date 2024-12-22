const saveOptions = () => {
    const imageOption = document.querySelector('input[name="image-option"]:checked')?.value;
    const deleteHash = document.getElementById('delete-hash').value;
    const clientId = document.getElementById('client-id').value;
    const extensionState = document.querySelector('input[name="answer"]:checked')?.id;

    chrome.storage.sync.set(
        { 
            imageOption: imageOption, 
            deleteHash: deleteHash, 
            clientId: clientId,
            extensionState: extensionState
        },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        { imageOption: 'download', deleteHash: '', clientId: '', extensionState: 'yes' },
        (items) => {
            if (items.imageOption === 'upload') {
                document.getElementById('upload').checked = true;
                toggleImgurFields(true);
            } else {
                document.getElementById('download').checked = true;
                toggleImgurFields(false);
            }
            document.getElementById('delete-hash').value = items.deleteHash;
            document.getElementById('client-id').value = items.clientId;

            if (items.extensionState === 'yes') {
                document.getElementById('on').checked = true;
            } else {
                document.getElementById('off').checked = true;
            }
        }
    );
};


function toggleImgurFields(show) {
    const imgurFields = document.getElementById("imgur-fields");
    if (show) {
        imgurFields.style.display = "block";
    } else {
        imgurFields.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    
    document.getElementById('save').addEventListener('click', saveOptions);
        document.getElementById('download').addEventListener('change', () => {
        toggleImgurFields(false);
    });
    document.getElementById('upload').addEventListener('change', () => {
        toggleImgurFields(true);
    });
});
