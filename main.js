
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

    // --- Gemini API 설정 ---
    // 주의: 실제 서비스에서는 백엔드를 통해 API 키를 숨겨야 하지만, 
    // 현재는 프로토타입 제작을 위해 프론트엔드에서 직접 사용합니다.
    const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HEREAIzaSyBaTVgeCBm12WIYAsHL8wGag3UsBUv_67I'; 

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

    // 파일을 Base64로 변환하는 헬퍼 함수
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }

    // --- Main Logic: Show Results ---
    showResultBtn.addEventListener('click', async () => {
        const genderInput = document.querySelector('input[name="gender"]:checked');
        if (!nameInput.value || !birthdateInput.value || !birthtimeInput.value || !photoInput.files[0] || !genderInput) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            alert('Gemini API 키를 코드에 입력해주세요. (main.js의 GEMINI_API_KEY 변수)');
            return;
        }

        const gender = genderInput.value;
        const name = nameInput.value;
        const birthInfo = `${birthdateInput.value} ${birthtimeInput.value}`;

        // 2. Transition to Result Page
        mainContent.classList.add('hidden');
        resultPage.classList.remove('hidden');
        loader.style.display = 'block';
        resultContentContainer.innerHTML = ''; 
        window.scrollTo(0, 0);

        try {
            // 3. Gemini API 호출
            const imagePart = await fileToGenerativePart(photoInput.files[0]);
            const prompt = `
                당신은 최고의 관상가이자 사주 명리학자입니다. 
                첨부된 사진의 얼굴 특징(관상)과 제공된 사주 정보(생년월일시: ${birthInfo}, 성별: ${gender})를 분석하여 다음 형식의 JSON 데이터로 답변해주세요.
                이름은 ${name}입니다.

                JSON 형식:
                {
                    "physiognomy": "얼굴의 주요 특징과 그에 따른 성격/운세 분석 결과 (300자 내외)",
                    "saju": "생년월일시를 바탕으로 한 오행 분석과 현재 운세 풀이 (300자 내외)",
                    "match": {
                        "name": "추천하는 가상의 인연 이름",
                        "photo_concept": "어울리는 상대방의 스타일 설명",
                        "compatibility": "두 사람의 관상 및 사주 조화/궁합 풀이 (200자 내외)",
                        "element": "상대의 대표 오행 (예: 수(水))"
                    }
                }
                
                답변은 반드시 유효한 JSON 형식이어야 하며, 한국어로 작성하세요.
            `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }, imagePart] }]
                })
            });

            const data = await response.json();
            const resultText = data.candidates[0].content.parts[0].text;
            
            // JSON 응답에서 불필요한 마크다운 제거
            const cleanJson = resultText.replace(/```json|```/g, '').trim();
            const aiResult = JSON.parse(cleanJson);

            // 4. Display results
            loader.style.display = 'none';
            renderResults(name, aiResult);
        } catch (error) {
            console.error('Gemini API Error:', error);
            alert('AI 분석 중 오류가 발생했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.');
            loader.style.display = 'none';
            mainContent.classList.remove('hidden');
            resultPage.classList.add('hidden');
        }
    });

    // --- Rendering Function ---
    function renderResults(name, aiResult) {
        const resultHTML = `
            <div class="user-profile-section">
                <h2>${name}님의 AI 상세 분석 보고서</h2>
                <div class="analysis-card">
                    <h3>관상(Physiognomy) 실시간 분석</h3>
                    <p class="analysis-detail">${aiResult.physiognomy}</p>
                    <p class="theory-note">AI가 이미지 픽셀 데이터를 기반으로 눈, 코, 입의 위치와 형태를 정밀 분석한 결과입니다.</p>
                </div>
                <div class="analysis-card">
                    <h3>사주(Saju) 명리 심층 분석</h3>
                    <p class="analysis-detail">${aiResult.saju}</p>
                    <p class="theory-note">태어난 시점의 천체 에너지 분포와 대운의 흐름을 계산한 결과입니다.</p>
                </div>
            </div>

            <div class="match-section">
                <h2>AI가 찾은 운명의 데스티니</h2>
                <p class="match-intro">당신의 에너지 파동과 가장 완벽한 하모니를 이루는 가상의 인연을 매칭했습니다.</p>
                <div class="match-card">
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop" alt="Match" class="match-photo">
                    <div class="match-info">
                        <h3>${aiResult.match.name}</h3>
                        <p><strong>특징:</strong> ${aiResult.match.photo_concept}</p>
                        <p><strong>타고난 기운:</strong> ${aiResult.match.element}</p>
                        <p><strong>궁합 풀이:</strong> ${aiResult.match.compatibility}</p>
                    </div>
                </div>
            </div>
            
            <button id="retryBtn" class="cta-button">다시 분석하기</button>
        `;
        resultContentContainer.innerHTML = resultHTML;

        document.getElementById('retryBtn').addEventListener('click', () => {
            resultPage.classList.add('hidden');
            mainContent.classList.remove('hidden');
            nameInput.value = '';
            birthdateInput.value = '';
            birthtimeInput.value = '';
            photoInput.value = '';
            imagePreview.innerHTML = '';
            dropZone.querySelector('p').style.display = 'block';
            window.scrollTo(0, 0);
        });
    }
});
