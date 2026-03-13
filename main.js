document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('face-photo');
    const photoPreview = document.getElementById('photo-preview-img');

    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    const matchingForm = document.getElementById('matching-form');
    matchingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(matchingForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Form Data:', data);

        // Here you would typically send the data to a server
        // for AI analysis and matching.
        alert('운명의 상대를 찾고 있습니다... (콘솔에서 데이터를 확인하세요)');
    });
});