document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const coursesContainer = document.getElementById('coursesContainer');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('errorMessage');
    const retryBtn = document.getElementById('retryBtn');
    const scanBtn = document.getElementById('scanBtn');
    const instructorModal = document.getElementById('instructorModal');
    const closeModal = document.getElementById('closeModal');
    
    // بارگذاری دوره‌ها
    // loadCourses();
    
    // رویداد تلاش مجدد
    // retryBtn.addEventListener('click', loadCourses);
    
    // رویداد اسکن بارکد (شبیه‌سازی)
    // scanBtn.addEventListener('click', function() {
    //     // در حالت واقعی اینجا کد اسکن بارکد قرار می‌گیرد
    //     const courseId = prompt("لطفاً کد دوره را وارد کنید (برای شبیه‌سازی از 1 تا 5):");
    //     if (courseId) {
    //         scrollToCourse(courseId);
    //     }
    // });
    
    // بستن مودال
    closeModal.addEventListener('click', function() {
        instructorModal.classList.add('hidden');
    });
    
    // بارگذاری دوره‌ها از JSON
    // function loadCourses() {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        coursesContainer.innerHTML = '';
        
        fetch('data/courses.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayCourses(data.courses);
                loadingElement.classList.add('hidden');
            })
            .catch(error => {
                console.error('Error loading courses:', error);
                loadingElement.classList.add('hidden');
                errorElement.classList.remove('hidden');
            });
    // }
    
    // نمایش دوره‌ها
    function displayCourses(courses) {
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1';
            courseCard.innerHTML = `
                <div class="relative">
                    <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
                    <span class="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${course.category}
                    </span>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${course.title}</h3>
                    <p class="text-gray-600 mb-4">${course.description}</p>
                    
                    <div class="flex items-center text-gray-500 mb-4">
                        <i class="far fa-clock ml-2"></i>
                        <span>${course.duration} ساعت</span>
                    </div>
                    
                    <div class="mb-4">
                        <h4 class="font-medium mb-2">زمان‌بندی:</h4>
                        <ul class="space-y-1">
                            ${course.schedule.map(session => `
                                <li class="flex items-center text-gray-600">
                                    <i class="far fa-calendar-alt ml-2"></i>
                                    ${session.day}: ${session.time}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <button onclick="showInstructorModal('${course.instructor.id}')" 
                            class="text-blue-600 hover:text-blue-800 font-medium">
                            <i class="far fa-user ml-2"></i>مشاهده مربی
                        </button>
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            ${course.price.toLocaleString()} تومان
                        </span>
                    </div>
                </div>
            `;
            courseCard.id = `course-${course.id}`;
            coursesContainer.appendChild(courseCard);
        });
    }
    
    // اسکرول به دوره خاص
    function scrollToCourse(courseId) {
        const courseElement = document.getElementById(`course-${courseId}`);
        if (courseElement) {
            courseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // هایلایت کردن دوره
            courseElement.classList.add('ring-4', 'ring-blue-500', 'animate-pulse');
            setTimeout(() => {
                courseElement.classList.remove('ring-4', 'ring-blue-500', 'animate-pulse');
            }, 3000);
        } else {
            alert('دوره با این کد یافت نشد.');
        }
    }
});

// نمایش مودال مربی (تابع سراسری)
function showInstructorModal(instructorId) {
    fetch('data/courses.json')
        .then(response => response.json())
        .then(data => {
            const instructor = data.instructors.find(inst => inst.id === instructorId);
            if (instructor) {
                document.getElementById('instructorName').textContent = instructor.name;
                document.getElementById('instructorImage').src = instructor.image;
                document.getElementById('instructorBio').textContent = instructor.bio;
                document.getElementById('instructorExperience').textContent = instructor.experience;
                document.getElementById('instructorLinkedin').href = instructor.social.linkedin || '#';
                document.getElementById('instructorWebsite').href = instructor.social.website || '#';
                
                const modal = document.getElementById('instructorModal');
                modal.classList.remove('hidden');
            }
        });
}