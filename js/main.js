/* ============================================
   AR TECHNOCODE - Landing Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // --- Space Background: Dynamic Stars & Comets ---
    function initSpaceBackground() {
        const starsBg = document.querySelector('.stars-bg');
        if (!starsBg) return;

        // Generate twinkling stars
        const numStars = 40;
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${1.5 + Math.random() * 3}s`);
            star.style.setProperty('--delay', `${Math.random() * 4}s`);

            // Some stars are brighter/bigger
            if (Math.random() > 0.7) {
                star.style.width = '3px';
                star.style.height = '3px';
            }

            starsBg.appendChild(star);
        }

        // Generate comets / shooting stars
        const numComets = 4;
        for (let i = 0; i < numComets; i++) {
            const comet = document.createElement('div');
            comet.className = 'comet';
            comet.style.left = `${-5 + Math.random() * 30}%`;
            comet.style.top = `${5 + Math.random() * 40}%`;
            comet.style.setProperty('--comet-duration', `${5 + Math.random() * 8}s`);
            comet.style.setProperty('--comet-delay', `${i * 3 + Math.random() * 5}s`);

            // Vary comet sizes
            const cometLength = 80 + Math.random() * 60;
            comet.style.width = `${cometLength}px`;

            starsBg.appendChild(comet);
        }
    }

    initSpaceBackground();


    // --- Booking System (2-Step: Qualification Form + Calendar) ---
    const qualificationForm = document.getElementById('qualification-form');
    const bookingStep1 = document.getElementById('booking-step-1');
    const bookingStep2 = document.getElementById('booking-step-2');
    const backToFormBtn = document.getElementById('back-to-form');

    // Store lead data for potential backend integration
    let leadData = {};

    if (qualificationForm) {
        qualificationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = qualificationForm.querySelector('button[type="submit"]');

            // Collect form data
            leadData = {
                name: document.getElementById('q-name').value,
                company: document.getElementById('q-company').value,
                email: document.getElementById('q-email').value,
                phone: document.getElementById('q-phone').value,
                budget: document.getElementById('q-budget').value,
                timeline: document.getElementById('q-timeline').value,
                timestamp: new Date().toISOString()
            };

            // Validate all fields
            if (!leadData.name || !leadData.company || !leadData.email || !leadData.phone || !leadData.budget || !leadData.timeline) {
                return;
            }

            // Loading state
            btn.textContent = 'Verificando disponibilidad...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Simulate API call to save lead data (replace with actual backend)
            setTimeout(() => {
                // Log lead data (in production, send to your CRM/backend)
                console.log('Lead captured:', leadData);

                // Store in localStorage as backup
                const leads = JSON.parse(localStorage.getItem('ar_leads') || '[]');
                leads.push(leadData);
                localStorage.setItem('ar_leads', JSON.stringify(leads));

                // Transition to Step 2 (Calendar)
                bookingStep1.classList.remove('active');
                bookingStep2.classList.add('active');

                // Reset button for next time
                btn.textContent = 'Continuar a Agendar Cita →';
                btn.style.opacity = '1';
                btn.disabled = false;

                // Scroll to calendar section
                bookingStep2.scrollIntoView({ behavior: 'smooth', block: 'start' });

            }, 1000);
        });
    }

    // Back button functionality
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', function () {
            bookingStep2.classList.remove('active');
            bookingStep1.classList.add('active');
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Comparative Demo Logic ---
    class DemoChat {
        constructor() {
            this.humanChat = document.getElementById('human-chat');
            this.aiChat = document.getElementById('ai-chat');
            this.replayBtn = document.getElementById('replay-demo');
            this.humanStatus = document.querySelector('.human-side .demo-status');
            this.aiStatus = document.querySelector('.ai-side .demo-status');

            this.conversation = [
                {
                    role: 'customer',
                    text: 'Hola, quisiera agendar una limpieza dental y saber el precio.',
                    delay: 500
                },
                {
                    role: 'agent',
                    textHuman: 'Hola buenas tardes. Claro que si permítame un momento por favor reviso la agenda...',
                    textAI: '¡Hola! Claro que sí. El costo es de $800 MXN. Tengo disponibilidad hoy a las 4:00 PM o mañana a las 10:00 AM. ¿Cuál prefieres?',
                    delay: 1000
                },
                {
                    role: 'customer',
                    text: 'Mañana a las 10 estaría bien.',
                    delay: 800
                },
                {
                    role: 'agent',
                    textHuman: 'Ok... déjeme ver si está libre... mmm sí, me pasa su nombre completo?',
                    textAI: '¡Listo! Quedó agendada tu limpieza para mañana a las 10:00 AM. Te envié la confirmación por WhatsApp. 🦷✨',
                    delay: 1000
                }
            ];

            this.init();
        }

        init() {
            if (this.replayBtn) {
                this.replayBtn.addEventListener('click', () => this.startSimulation());

                // Start simulation when section is visible
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.startSimulation();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(document.querySelector('.comparative-demo'));
            }
        }

        async startSimulation() {
            // Reset
            this.humanChat.innerHTML = '';
            this.aiChat.innerHTML = '';
            this.replayBtn.disabled = true;
            this.replayBtn.style.opacity = '0.5';

            for (const turn of this.conversation) {
                if (turn.role === 'customer') {
                    // Customer message appears instantly on both sides
                    await this.addMessage(this.humanChat, turn.text, 'incoming', 0);
                    await this.addMessage(this.aiChat, turn.text, 'incoming', 0);
                } else {
                    // Agent Turn
                    // Run AI and Human in parallel but independent speeds
                    const aiPromise = this.typeMessage(this.aiChat, turn.textAI, 10); // Fast API speed
                    const humanPromise = this.typeMessage(this.humanChat, turn.textHuman, 100); // Slow human speed

                    await Promise.all([aiPromise, humanPromise]);
                }

                // Pause between turns
                await new Promise(r => setTimeout(r, turn.delay));
            }

            this.replayBtn.disabled = false;
            this.replayBtn.style.opacity = '1';
        }

        async addMessage(container, text, type, typingSpeed = 0) {
            return new Promise(resolve => {
                const msgDiv = document.createElement('div');
                msgDiv.className = `message msg-${type}`;
                container.appendChild(msgDiv);

                if (typingSpeed === 0) {
                    msgDiv.textContent = text;
                    container.scrollTop = container.scrollHeight;
                    resolve();
                } else {
                    // This logic is actually handled by typeMessage for the agent
                    msgDiv.textContent = text;
                    container.scrollTop = container.scrollHeight;
                    resolve();
                }
            });
        }

        async typeMessage(container, text, speed) {
            // Creating message bubble
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message msg-outgoing';
            container.appendChild(msgDiv);

            // Show "typing..." indicator logic could go here if more complex
            // Simulating typing
            for (let i = 0; i < text.length; i++) {
                msgDiv.textContent += text.charAt(i);
                container.scrollTop = container.scrollHeight;

                // Variance for human (more random delays) vs AI (consistent fast)
                let delay = speed;
                if (speed > 50) { // Human
                    // Random mistake pauses or speed bursts
                    if (Math.random() > 0.9) delay += 300; // Pause to think
                    if (Math.random() > 0.95) delay += 100; // Typo correction pause simulation
                } else {
                    // AI
                    delay = Math.random() * 5 + 5; // Super fast stream 5-10ms
                }

                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    // Initialize Demo
    new DemoChat();

});
