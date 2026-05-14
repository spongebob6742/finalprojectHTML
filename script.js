document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalBtn = document.querySelector('.modal-btn');
    
    function openModal() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
    
    if (modalBtn) {
        modalBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function scrollToBlock(blockId) {
        const targetBlock = document.getElementById(blockId);
        if (targetBlock) {
            const navigation = document.querySelector('.Navigation');
            const navigationHeight = navigation ? navigation.offsetHeight : 0;
            const targetPosition = targetBlock.getBoundingClientRect().top + window.pageYOffset - navigationHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                scrollToBlock(targetId);
                const mobileMenu = document.getElementById('navigationMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
    
    const footerNavButtons = document.querySelectorAll('.footer-nav-btn');
    footerNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                scrollToBlock(targetId);
            }
        });
    });
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navigationMenu = document.getElementById('navigationMenu');
    
    if (mobileMenuToggle && navigationMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navigationMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function(event) {
            if (navigationMenu.classList.contains('active') && 
                !navigationMenu.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                navigationMenu.classList.remove('active');
            }
        });
    }
    
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = Array.from(track.children);
        const cardCount = cards.length;
        let currentIndex = 0;
        let autoPlayInterval;
        
        function getCardsPerView() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }
        
        let cardsPerView = getCardsPerView();
        let cardWidth = 0;
        
        function updateCardWidths() {
            cardsPerView = getCardsPerView();
            const containerWidth = track.parentElement.offsetWidth;
            const gap = 20;
            const newCardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
            
            cards.forEach(card => {
                card.style.flex = `0 0 ${newCardWidth}px`;
                card.style.minWidth = `${newCardWidth}px`;
            });
            
            cardWidth = newCardWidth + gap;
            updateTrackPosition(false);
        }
        
        function getMaxIndex() {
            return Math.max(0, cardCount - cardsPerView);
        }
        
        function updateTrackPosition(animate = true) {
            if (animate) {
                track.style.transition = 'transform 0.5s ease-in-out';
            } else {
                track.style.transition = 'none';
            }
            const offset = -currentIndex * cardWidth;
            track.style.transform = `translateX(${offset}px)`;
            updateDots();
            if (!animate) {
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }
        }
        
        function createDots() {
            dotsContainer.innerHTML = '';
            const maxIndex = getMaxIndex();
            const dotsCount = maxIndex + 1;
            
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateTrackPosition(true);
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function nextSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateTrackPosition(true);
        }
        
        function prevSlide() {
            const maxIndex = getMaxIndex();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex;
            }
            updateTrackPosition(true);
        }
        
        function startAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        
        function resetAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        }
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldCardsPerView = cardsPerView;
                updateCardWidths();
                cardsPerView = getCardsPerView();
                
                if (oldCardsPerView !== cardsPerView) {
                    currentIndex = 0;
                    createDots();
                    updateTrackPosition(false);
                } else {
                    createDots();
                    updateTrackPosition(false);
                }
            }, 200);
        });
        
        updateCardWidths();
        createDots();
        startAutoPlay();
        
        const galleryContainer = document.querySelector('.block6');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', () => {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
            });
            
            galleryContainer.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
            
            galleryContainer.addEventListener('touchstart', () => {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
            });
            
            galleryContainer.addEventListener('touchend', () => {
                startAutoPlay();
            });
        }
    }
    
    const form = document.getElementById("myform");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            let username = document.getElementById("username").value;
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let isValid = true;

            if (username.trim() === "") {
                document.getElementById("usernameError").textContent = "Имя пользователя обязательно";
                isValid = false;
            } else {
                document.getElementById("usernameError").textContent = "";
            }

            if (email.trim() === "") {
                document.getElementById("emailerror").textContent = "Email обязателен";
                isValid = false;
            } else if (!emailPattern.test(email)) {
                document.getElementById("emailerror").textContent = "Введите корректный email";
                isValid = false;
            } else {
                document.getElementById("emailerror").textContent = "";
            }

            if (password.trim() === "") {
                document.getElementById("passwordError").textContent = "Пароль обязателен";
                isValid = false;
            } else if (password.length < 4) {
                document.getElementById("passwordError").textContent = "Пароль должен содержать минимум 4 символа";
                isValid = false;
            } else {
                document.getElementById("passwordError").textContent = "";
            }

            if (isValid) {
                alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
                form.reset();
            }
        });
    }
});