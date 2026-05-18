// Initialize icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const mobileCta = document.getElementById('mobile-cta');
    const footer = document.querySelector('footer');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'border-b', 'border-white/10');
            navbar.querySelector('.absolute').classList.replace('bg-brand-dark/80', 'bg-brand-darker/95');
        } else {
            navbar.classList.remove('shadow-lg', 'border-b', 'border-white/10');
            navbar.querySelector('.absolute').classList.replace('bg-brand-darker/95', 'bg-brand-dark/80');
        }

        // Hide mobile CTA when reaching footer to prevent overlap
        if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            if (footerTop < window.innerHeight) {
                document.body.classList.add('footer-visible');
            } else {
                document.body.classList.remove('footer-visible');
            }
        }
    });

    // Mobile Menu Toggle logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = (isOpen) => {
        const whatsappBtn = document.querySelector('a[href*="wa.me"]');
        if (isOpen) {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Lock scroll
            if (whatsappBtn) whatsappBtn.classList.add('opacity-0', 'pointer-events-none');
        } else {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Unlock scroll
            if (whatsappBtn) whatsappBtn.classList.remove('opacity-0', 'pointer-events-none');
        }
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleMenu(true));
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    }

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Form Handling
    const leadForm = document.getElementById('lead-form');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const formSuccess = document.getElementById('form-success');

    if (phoneInput) {
        // Real-time phone formatting (e.g. (123) 456-7890)
        phoneInput.addEventListener('input', (e) => {
            let input = e.target.value.replace(/\D/g, '');
            
            // Remove error styling dynamically if they start typing/correcting
            if (phoneError) phoneError.classList.add('hidden');
            phoneInput.classList.remove('border-red-500');

            if (input.length === 0) {
                e.target.value = '';
                return;
            }
            
            let formatted = '';
            if (input.length <= 3) {
                formatted = `(${input}`;
            } else if (input.length <= 6) {
                formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
            } else {
                formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
            }
            e.target.value = formatted;
        });

        // Prevent typing non-digits or exceeding 10 raw digits
        phoneInput.addEventListener('keydown', (e) => {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            if (allowedKeys.includes(e.key)) return;
            
            const isDigit = /\d/.test(e.key);
            const rawLength = e.target.value.replace(/\D/g, '').length;
            
            if (!isDigit || rawLength >= 10) {
                e.preventDefault();
            }
        });
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate Phone digits count
            const phoneVal = phoneInput.value.replace(/\D/g, '');
            if (phoneVal.length !== 10) {
                phoneError.classList.remove('hidden');
                phoneInput.classList.add('border-red-500');
                return;
            } else {
                phoneError.classList.add('hidden');
                phoneInput.classList.remove('border-red-500');
            }

            // Mock Submission
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Processing...';
            submitBtn.disabled = true;
            lucide.createIcons();

            setTimeout(() => {
                formSuccess.classList.remove('hidden');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                leadForm.reset();
                lucide.createIcons();

                // Optional: Auto redirect to WhatsApp after 2 seconds
                // setTimeout(() => {
                //    window.open('https://wa.me/13478134200?text=I%20have%20submitted%20the%20form%20for%20a%20free%20trial', '_blank');
                // }, 2000);
            }, 1500);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Fitness & Plan Matcher Calculator Logic ---
    const btnMale = document.getElementById('btn-male');
    const btnFemale = document.getElementById('btn-female');
    const inputAge = document.getElementById('calc-age');
    const inputHeight = document.getElementById('calc-height');
    const inputWeight = document.getElementById('calc-weight');
    const selectActivity = document.getElementById('calc-activity');
    const selectGoal = document.getElementById('calc-goal');
    
    const resultCal = document.getElementById('calc-result');
    const summaryText = document.getElementById('calc-summary');
    const recPlanName = document.getElementById('rec-plan-name');
    const recPlanDesc = document.getElementById('rec-plan-desc');
    const btnLockPlan = document.getElementById('btn-lock-plan');
    
    let activeGender = 'male';

    if (btnMale && btnFemale) {
        btnMale.addEventListener('click', () => {
            activeGender = 'male';
            btnMale.classList.add('active', 'bg-brand-neon', 'text-black');
            btnMale.classList.remove('bg-transparent', 'text-gray-400', 'border-white/10');
            btnFemale.classList.remove('active', 'bg-brand-neon', 'text-black');
            btnFemale.classList.add('bg-transparent', 'text-gray-400', 'border-white/10');
            calculateCalories();
        });

        btnFemale.addEventListener('click', () => {
            activeGender = 'female';
            btnFemale.classList.add('active', 'bg-brand-neon', 'text-black');
            btnFemale.classList.remove('bg-transparent', 'text-gray-400', 'border-white/10');
            btnMale.classList.remove('active', 'bg-brand-neon', 'text-black');
            btnMale.classList.add('bg-transparent', 'text-gray-400', 'border-white/10');
            calculateCalories();
        });
    }

    function calculateCalories() {
        if (!inputAge || !inputHeight || !inputWeight || !selectActivity || !selectGoal) return;

        let age = parseFloat(inputAge.value);
        let height = parseFloat(inputHeight.value);
        let weight = parseFloat(inputWeight.value);

        // Clamp stats to logical human bounds to prevent mathematical errors / negative calculations
        if (isNaN(age) || age < 12) age = 12;
        if (age > 90) age = 90;
        
        if (isNaN(height) || height < 100) height = 100;
        if (height > 230) height = 230;
        
        if (isNaN(weight) || weight < 30) weight = 30;
        if (weight > 200) weight = 200;

        const activity = parseFloat(selectActivity.value) || 1.375;
        const goal = selectGoal.value;

        // BMR (Mifflin-St Jeor)
        let bmr = 0;
        if (activeGender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // TEE
        const tee = bmr * activity;
        let finalCalories = tee;
        let goalText = '';
        let recPlan = '';
        let recDesc = '';
        let leadGoalVal = 'general';

        if (goal === 'weight_loss') {
            finalCalories = tee * 0.82; // 18% deficit
            goalText = 'To achieve your weight loss goals, we recommend a targeted calorie deficit plan with proper protein tracking.';
            recPlan = 'PRO TRANSFORMATION';
            recDesc = 'Includes complete customized diet mapping, 1-on-1 personal training, and unlimited access to CrossFit arena.';
            leadGoalVal = 'weight_loss';
        } else if (goal === 'muscle_gain') {
            finalCalories = tee * 1.12; // 12% surplus
            goalText = 'To maximize hypertrophy and gain lean muscle, we recommend a clean bulk calorie target and heavy load progressive training.';
            recPlan = 'PRO TRANSFORMATION';
            recDesc = 'Includes complete customized diet mapping, 1-on-1 personal training, and unlimited access to CrossFit arena.';
            leadGoalVal = 'muscle_gain';
        } else if (goal === 'endurance') {
            finalCalories = tee; // Maintenance
            goalText = 'To support intense conditioning and functional fitness, focus on high quality complex carbohydrates and high output endurance nutrition.';
            recPlan = 'QUARTERLY ELITE';
            recDesc = 'Unlock special pricing, priority access to premium equipment, merchandise, and personal body composition analysis.';
            leadGoalVal = 'crossfit';
        } else {
            finalCalories = tee; // Maintenance
            goalText = 'To maintain current weight and stay active, keep your calories in equilibrium with optimized micronutrient ratios.';
            recPlan = 'BASIC';
            recDesc = 'Unlock complete access to cardio and weight training, pristine locker facilities, and a general fitness plan.';
            leadGoalVal = 'general';
        }

        if (resultCal) {
            resultCal.textContent = Math.round(finalCalories).toLocaleString();
        }
        if (summaryText) {
            summaryText.textContent = goalText;
        }
        if (recPlanName) {
            recPlanName.textContent = recPlan;
        }
        if (recPlanDesc) {
            recPlanDesc.textContent = recDesc;
        }

        // Save selected plan name as dataset on lock button
        if (btnLockPlan) {
            btnLockPlan.dataset.recommendedPlan = recPlan;
            btnLockPlan.dataset.leadGoal = leadGoalVal;
        }
    }

    // Attach event listeners for inputs
    [inputAge, inputHeight, inputWeight, selectActivity, selectGoal].forEach(element => {
        if (element) {
            element.addEventListener('input', calculateCalories);
            element.addEventListener('change', calculateCalories);
        }
    });

    // Run once on load to pre-populate recommendation
    calculateCalories();

    // Lock plan click action
    if (btnLockPlan) {
        btnLockPlan.addEventListener('click', () => {
            const plan = btnLockPlan.dataset.recommendedPlan;
            const leadGoal = btnLockPlan.dataset.leadGoal;
            
            let planCardId = 'plan-pro';
            if (plan === 'BASIC') planCardId = 'plan-basic';
            if (plan === 'QUARTERLY ELITE') planCardId = 'plan-elite';
            
            const targetCard = document.getElementById(planCardId);
            const pricingSection = document.getElementById('pricing');
            const leadGoalSelect = document.getElementById('goal');

            // Set lead goal
            if (leadGoalSelect && leadGoal) {
                leadGoalSelect.value = leadGoal;
            }

            if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight plan card dynamically
                if (targetCard) {
                    setTimeout(() => {
                        targetCard.classList.add('ring-4', 'ring-brand-neon', 'scale-105');
                        targetCard.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        
                        setTimeout(() => {
                            targetCard.classList.remove('ring-4', 'ring-brand-neon', 'scale-105');
                        }, 3000);
                    }, 500);
                }
            }
        });
    }

    // Membership plan choose click action
    const planButtons = document.querySelectorAll('a[data-plan]');
    planButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = btn.getAttribute('data-plan');
            const leadGoalSelect = document.getElementById('goal');
            const trialSection = document.getElementById('trial');
            
            // Map the selected plan to a logical form goal selection
            if (leadGoalSelect) {
                if (plan === 'BASIC') leadGoalSelect.value = 'general';
                else if (plan === 'PRO') leadGoalSelect.value = 'muscle_gain';
                else if (plan === 'ELITE') leadGoalSelect.value = 'crossfit';
            }

            if (trialSection) {
                trialSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Reviews Carousel Slider ---
    const track = document.getElementById('reviews-track');
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dotsContainer = document.getElementById('reviews-dots');
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
    
    let currentIndex = 0;
    let autoPlayTimer = null;
    const autoPlayInterval = 5000; // Change every 5 seconds

    if (track && slides.length > 0) {
        function updateSlider() {
            // Translate the track horizontally
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots active/inactive classes
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.className = 'w-3 h-3 rounded-full bg-brand-neon transition-all cursor-pointer';
                } else {
                    dot.className = 'w-3 h-3 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer';
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
        }

        // Add button event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        // Add dots click listeners
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
                resetAutoPlay();
            });
        });

        // Initialize AutoPlay
        resetAutoPlay();
        updateSlider();
    }
});
