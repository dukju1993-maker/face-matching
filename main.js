
document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const resultPage = document.getElementById('result-page');
    const showResultBtn = document.getElementById('showResultBtn');
    const loader = document.getElementById('loader');
    const resultContentContainer = document.getElementById('result-content-container');

    const nameInput = document.getElementById('name');
    const birthdateInput = document.getElementById('birthdate');
    const birthtimeInput = document.getElementById('birthtime');
    const photoInput = document.getElementById('photo');
    const imagePreview = document.getElementById('image-preview');
    const dropZone = document.getElementById('drop-zone');

    // Photo upload logic
    dropZone.addEventListener('click', () => photoInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            photoInput.files = files;
            previewImage(files[0]);
        }
    });
    photoInput.addEventListener('change', () => {
        if (photoInput.files.length > 0) {
            previewImage(photoInput.files[0]);
        }
    });

    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="preview">`;
            dropZone.querySelector('p').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // --- Main Logic: Show Results ---
    showResultBtn.addEventListener('click', async () => {
        // 1. Validate Inputs
        if (!nameInput.value || !birthdateInput.value || !birthtimeInput.value || !photoInput.files[0]) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

        // 2. Transition to Result Page
        mainContent.classList.add('hidden');
        resultPage.classList.remove('hidden');
        loader.style.display = 'block';
        resultContentContainer.innerHTML = ''; // Clear previous results

        // 3. AI Analysis (Simulated Delay)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // 4. Fetch Knowledge Bases
        const [physiognomyKB, sajuKB] = await Promise.all([
            fetch('physiognomy-kb.json').then(res => res.json()),
            fetch('saju-kb.json').then(res => res.json())
        ]);

        // 5. Perform Saju Analysis
        const sajuResult = getSajuAnalysis(birthdateInput.value, birthtimeInput.value, sajuKB);
        
        // 6. Perform Physiognomy Analysis (Random for now)
        const physiognomyResult = getPhysiognomyAnalysis(physiognomyKB);

        // 7. Generate Mock Matches
        const matches = generateMatches(sajuResult.element, sajuKB);

        // 8. Display results
        loader.style.display = 'none';
        renderResults(nameInput.value, physiognomyResult, sajuResult, matches);
    });

    // --- Saju Analysis Function ---
    function getSajuAnalysis(birthdate, birthtime, sajuKB) {
        const date = new Date(`${birthdate}T${birthtime}`);
        const saju = manseryeok.getSaju(date, "male"); // Gender can be dynamic

        // Find the user's primary element from the day's Heavenly Stem (일간)
        const dayGanHanja = saju.day.gan.hanja;
        const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const ELEMENTS = ['목(木)', '목(木)', '화(火)', '화(火)', '토(土)', '토(土)', '금(金)', '금(金)', '수(水)', '수(水)'];
        const userElement = ELEMENTS[GAN.indexOf(dayGanHanja)];
        
        const elementInfo = sajuKB.elements.find(el => el.name === userElement);

        return {
            element: elementInfo,
            fullSaju: saju, // For potential future use
            description: `당신은 ${elementInfo.korean_name}의 기운을 타고났습니다. ${elementInfo.description}`
        };
    }

    // --- Physiognomy Analysis Function ---
    function getPhysiognomyAnalysis(physiognomyKB) {
        const allFeatures = [...physiognomyKB.faceShapes, ...physiognomyKB.eyes, ...physiognomyKB.noses];
        const randomFeature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
        return randomFeature.shape ? 
            `전체적으로 ${randomFeature.shape}의 기운이 느껴집니다. ${randomFeature.description}` :
            `${randomFeature.feature} 특징이 돋보입니다. ${randomFeature.description}`;
    }

    // --- Match Generation Function ---
    function generateMatches(userElement, sajuKB) {
        const goodMatchElement = sajuKB.relationships.creation_cycle.pairs[userElement.name.split('(')[0]];
        
        const matchElementInfo = sajuKB.elements.find(el => el.name.startsWith(goodMatchElement.split(' ')[0]));

        // Mock data for matches - in a real app, this would come from a database
        const potentialMatches = [
            { name: '김지우', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', element: '수(水)' },
            { name: '이서아', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', element: '목(木)' },
             { name: '박채원', photo: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', element: '화(火)' },
             { name: '최유나', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', element: '토(土)' },
             { name: '정서윤', photo: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', element: '금(金)' }
        ];

        // Find a match with a compatible element
        const compatibleMatch = potentialMatches.find(p => p.element === matchElementInfo.name);
        
        if(compatibleMatch){
            compatibleMatch.compatibility = `당신의 ${userElement.korean_name} 기운은 이 분의 ${matchElementInfo.korean_name} 기운을 만나 더욱 강하게 타오를 것입니다. ${sajuKB.relationships.creation_cycle.description}`;
             return [compatibleMatch];
        } else {
            // Return a default match if no direct compatibility is found in mock data
            const defaultMatch = potentialMatches[0];
            defaultMatch.compatibility = "서로 다른 매력이 조화를 이루는 관계입니다.";
            return [defaultMatch];
        }
    }

    // --- Rendering Function ---
    function renderResults(name, physiognomy, saju, matches) {
        const resultHTML = `
            <div class="user-profile-section">
                <h2>${name}님의 분석 결과</h2>
                <div class="analysis-card">
                    <h3>관상 분석</h3>
                    <p>${physiognomy}</p>
                </div>
                <div class="analysis-card">
                    <h3>사주 분석</h3>
                    <p>${saju.description}</p>
                </div>
            </div>

            <div class="match-section">
                <h2>최고의 인연</h2>
                ${matches.map(match => `
                    <div class="match-card">
                        <img src="${match.photo}" alt="${match.name}" class="match-photo">
                        <div class="match-info">
                            <h3>${match.name}</h3>
                            <p><strong>타고난 기운:</strong> ${match.element}</p>
                            <p><strong>궁합 풀이:</strong> ${match.compatibility}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button id="retryBtn" class="cta-button">다시 분석하기</button>
        `;
        resultContentContainer.innerHTML = resultHTML;

        // Add event listener for the new retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            resultPage.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Reset form fields
            nameInput.value = '';
            birthdateInput.value = '';
            birthtimeInput.value = '';
            photoInput.value = '';
            imagePreview.innerHTML = '';
             dropZone.querySelector('p').style.display = 'block';
        });
    }
});
