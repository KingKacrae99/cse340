document.addEventListener("DOMContentLoaded", () => {
    const imageFileInput = document.getElementById("inv_image");
    const previewImage = document.getElementById("ui-preview-img");
    const previewBlur = document.getElementById("ui-preview-blur");
    const placeholderWrapper = document.getElementById("preview-placeholder");
    const previewWrapper = document.getElementById("preview-wrapper");
    const statusText = document.getElementById("upload-status-text");

    if (imageFileInput) {
        imageFileInput.addEventListener("change", function() {
            const file = this.files[0];
            
            if (file) {
                // Create an ephemeral virtual DOM URL pointer mapping directly to the file payload
                const objectUrl = URL.createObjectURL(file);
                
                // Reveal the hidden image nodes
                previewImage.src = objectUrl;
                previewBlur.src = objectUrl;
                
                previewImage.classList.remove("hidden");
                previewBlur.classList.remove("hidden");
                
                // Hide the text placeholders and highlight the active layout border frame
                placeholderWrapper.classList.add("hidden");
                previewWrapper.classList.remove("border-neutral-900");
                previewWrapper.classList.add("border-neutral-700", "shadow-lg");
                
                // Update drag zone text string to state the asset title safely
                if (statusText) {
                    statusText.innerText = `Selected Asset Matrix: ${file.name}`;
                    statusText.classList.remove("text-neutral-400");
                    statusText.classList.add("text-[#DC2626]", "font-mono");
                }
                
                // Memory garbage collection cleanup anchor mapping
                previewImage.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                };
            }
        });
    }
});
