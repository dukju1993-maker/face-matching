document.addEventListener('DOMContentLoaded', () => {
    // Page elements
    const mainContent = document.getElementById('main-content');
    const resultPage = document.getElementById('result-page');

    // Form and button elements
    const userInfoForm = document.getElementById('userInfoForm');
    const showResultBtn = document.getElementById('showResultBtn');

    // Drag-and-drop file upload elements
    const dropZone = document.getElementById('drop-zone');
    const photoInput = document.getElementById('photo');
    const imagePreview = document.getElementById('image-preview');
    
    let uploadedFile = null;

    // --- File Upload Logic ---

    // 1. Drag and Drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            photoInput.files = files;
            handleFile(files[0]);
        }
    });

    // 2. Click to upload event
    dropZone.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', () => {
        if (photoInput.files.length > 0) {
            handleFile(photoInput.files[0]);
        }
    });

    /**
     * Handles the file once it's selected or dropped.
     * @param {File} file The uploaded file.
     */
    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded face photo">`;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedFile = null;
            imagePreview.innerHTML = '';
            alert('이미지 파일만 업로드할 수 있습니다.');
        }
    }

    // --- Page Navigation and Result Logic ---

    showResultBtn.addEventListener('click', () => {
        // Basic validation
        const name = document.getElementById('name').value;
        const birthdate = document.getElementById('birthdate').value;
        if (!name || !birthdate || !uploadedFile) {
            alert('이름, 생년월일을 입력하고 얼굴 사진을 업로드해주세요.');
            return;
        }

        // Switch pages
        mainContent.classList.add('hidden');
        resultPage.classList.remove('hidden');

        // Start the analysis simulation
        simulateAnalysis();
    });
    
    // Prevent default form submission
    userInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });


    /**
     * Simulates a backend analysis process.
     */
    function simulateAnalysis() {
        const loader = document.getElementById('loader');
        const resultHeader = resultPage.querySelector('h2');
        const resultContent = document.getElementById('resultContent');
        
        // Show loader and hide results
        loader.classList.remove('hidden');
        resultContent.classList.add('hidden');
        resultHeader.textContent = '매칭 결과 분석중...';

        setTimeout(() => {
            // Hide loader and show results
            loader.classList.add('hidden');
            resultContent.classList.remove('hidden');
            resultHeader.textContent = '매칭 결과';
            
            displayResults();
        }, 3000); // 3-second delay
    }

    /**
     * Generates and displays mock matching results.
     */
    function displayResults() {
        const resultContent = document.getElementById('resultContent');
        resultContent.innerHTML = ''; // Clear previous results

        const mockResults = [
            {
                name: '김민준',
                matchRate: '92%',
                description: '다정하고 유머러스한 성격의 소유자. 당신과 가치관이 매우 잘 맞습니다.',
                img: `https://i.pravatar.cc/300?u=man1`
            },
            {
                name: '이서아',
                matchRate: '88%',
                description: '예술적인 감각이 뛰어나고 대화가 잘 통하는 상대입니다. 함께 있으면 즐거울 거예요.',
                img: `https://i.pravatar.cc/300?u=woman1`
            },
            {
                name: '박지훈',
                matchRate: '85%',
                description: '안정적인 성향으로, 당신에게 편안함을 줄 수 있는 좋은 파트너입니다.',
                img: `https://i.pravatar.cc/300?u=man2`
            }
        ];

        mockResults.forEach(person => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `
                <img src="${person.img}" alt="${person.name}의 사진">
                <h3>${person.name} (매칭률: ${person.matchRate})</h3>
                <p>${person.description}</p>
            `;

            resultContent.appendChild(item);
        });
    }
});