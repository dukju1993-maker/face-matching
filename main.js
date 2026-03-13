
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const mainPage = document.getElementById('main-page');
    const resultPage = document.getElementById('result-page');
    const analyzeBtn = document.getElementById('analyze-btn');
    const retryBtn = document.getElementById('retry-btn');
    
    const photoInput = document.getElementById('photo');
    const photoPreview = document.querySelector('.photo-preview');
    const photoUploader = document.querySelector('.photo-uploader');

    const userProfileEl = document.getElementById('user-profile');
    const matchListEl = document.getElementById('match-list');

    const loadingContainer = document.querySelector('.loading-container');
    const resultContent = document.querySelector('.result-content');

    // --- Event Listeners ---

    // 1. Photo Upload & Preview
    photoUploader.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.style.backgroundImage = `url(${e.target.result})`;
                photoUploader.querySelector('.photo-label').style.display = 'none'; 
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Analyze Button Click
    analyzeBtn.addEventListener('click', () => {
        mainPage.classList.add('fade-out');
        resultPage.classList.remove('hidden');

        setTimeout(() => {
            mainPage.classList.add('hidden');
            resultPage.classList.add('fade-in');

            setTimeout(() => {
                loadingContainer.classList.add('hidden');
                resultContent.classList.remove('hidden');
                displayResults();
            }, 2500); 

        }, 500);
    });

    // 3. Retry Button Click
    retryBtn.addEventListener('click', () => {
        resultPage.classList.remove('fade-in');
        resultPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        mainPage.classList.remove('fade-out');

        loadingContainer.classList.remove('hidden');
        resultContent.classList.add('hidden');
        
        photoPreview.style.backgroundImage = 'none';
        photoUploader.querySelector('.photo-label').style.display = 'block'; 
        document.querySelector('form').reset();
    });


    // --- Functions ---

    async function displayResults() {
        // --- Fetch Physiognomy Data ---
        const response = await fetch('physiognomy-kb.json');
        const kb = await response.json();

        // --- Get Random Analysis ---
        const allFeatures = [...kb.faceShapes, ...kb.eyes, ...kb.noses];
        const randomFeature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
        const analysis = randomFeature.shape ? 
            `리더십과 카리스마를 상징하는 ${randomFeature.shape}` :
            `${randomFeature.feature}으로, ${randomFeature.description}`;


        // --- Mock Data ---
        const user = {
            name: document.getElementById('name').value || '사용자',
            physiognomy: analysis,
            saju: '분석 중...' // Placeholder
        };

        const matches = [
            {
                name: '김지원',
                photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                physiognomy: '부드럽고 온화한 사슴상',
                saju: '시원한 물(水)의 기운',
                compatibility: '당신의 강한 불의 기운을 부드럽게 감싸 안아, 최고의 조화를 이룰 수 있습니다.'
            },
            {
                name: '박서연',
                photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                physiognomy: '지혜롭고 영리한 원숭이상',
                saju: '단단한 쇠(金)의 기운',
                compatibility: '당신의 리더십에 지혜를 더하고, 목표를 향해 함께 나아갈 강력한 파트너입니다.'
            }
        ];

        // --- Render User Profile ---
        userProfileEl.innerHTML = `<strong>${user.name}님</strong>은 ${user.physiognomy}이며, 사주 분석 결과는 ${user.saju}입니다. `;

        // --- Render Match List ---
        matchListEl.innerHTML = ''; 
        matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.innerHTML = `
                <img src="${match.photo}" alt="${match.name}" class="match-photo">
                <div class="match-info">
                    <h3>${match.name} (${match.physiognomy})</h3>
                    <p><strong>사주:</strong> ${match.saju}</p>
                    <p><strong>궁합:</strong> ${match.compatibility}</p>
                </div>
            `;
            matchListEl.appendChild(card);
        });
    }
});
