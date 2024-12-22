// Function to save options to chrome storage
const saveOptions = () => {
    const imageOption = document.querySelector('input[name="image-option"]:checked')?.value;
    const deleteHash = document.getElementById('delete-hash').value;
    const clientId = document.getElementById('client-id').value;
    const extensionState = document.querySelector('input[name="answer"]:checked')?.id; // Get the selected radio button for extension state

    chrome.storage.sync.set(
        { 
            imageOption: imageOption, 
            deleteHash: deleteHash, 
            clientId: clientId,
            extensionState: extensionState // Save the extension state
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

// Function to restore options from chrome storage
const restoreOptions = () => {
    chrome.storage.sync.get(
        { imageOption: 'download', deleteHash: '', clientId: '', extensionState: 'yes' }, // Set default value for extensionState
        (items) => {
            // Set radio buttons based on saved value for image options
            if (items.imageOption === 'upload') {
                document.getElementById('upload').checked = true;
                toggleImgurFields(true);
            } else {
                document.getElementById('download').checked = true;
                toggleImgurFields(false);
            }

            // Set the values for Imgur fields if available
            document.getElementById('delete-hash').value = items.deleteHash;
            document.getElementById('client-id').value = items.clientId;

            // Restore extension state
            if (items.extensionState === 'yes') {
                document.getElementById('yes').checked = true;
            } else {
                document.getElementById('no').checked = true;
            }
        }
    );
};


// Function to toggle Imgur fields visibility
function toggleImgurFields(show) {
    const imgurFields = document.getElementById("imgur-fields");
    if (show) {
        imgurFields.style.display = "block";
    } else {
        imgurFields.style.display = "none";
    }
}

// Add event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    restoreOptions(); // Call restoreOptions on DOM content load
    
    // Attach event listener for the save button
    document.getElementById('save').addEventListener('click', saveOptions);
    
    // Attach event listeners for the radio buttons to toggle Imgur fields
    document.getElementById('download').addEventListener('change', () => {
        toggleImgurFields(false);
    });
    document.getElementById('upload').addEventListener('change', () => {
        toggleImgurFields(true);
    });
});
