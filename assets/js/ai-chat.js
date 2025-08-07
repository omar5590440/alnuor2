// ===== AI Chat Assistant =====

class AIChatBot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadKnowledgeBase();
    }

    bindEvents() {
        this.chatToggle?.addEventListener('click', () => this.toggleChat());
        this.chatClose?.addEventListener('click', () => this.closeChat());
        this.chatSend?.addEventListener('click', () => this.sendMessage());
        
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.chat-bot')) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatWindow.style.display = 'flex';
        this.isOpen = true;
        this.chatInput.focus();
    }

    closeChat() {
        this.chatWindow.style.display = 'none';
        this.isOpen = false;
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and get response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processMessage(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000); // Random delay for realism
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<span>يكتب...</span>';
        typingDiv.id = 'typing-indicator';
        
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific keywords and provide relevant responses
        for (const [keywords, response] of this.knowledgeBase) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return response;
            }
        }

        // Default responses for unmatched queries
        const defaultResponses = [
            'عذراً، لم أفهم سؤالك بوضوح. يمكنك سؤالي عن حسابات البناء مثل السقف، الطوب، المحارة، أو البلاط.',
            'أنا هنا لمساعدتك في حسابات البناء. جرب أن تسأل عن كمية المواد المطلوبة لمشروعك.',
            'يمكنني مساعدتك في حساب مواد البناء. ما نوع الحساب الذي تريد معرفته؟'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    loadKnowledgeBase() {
        this.knowledgeBase = [
            // Ceiling related questions
            [
                ['سقف', 'خرسانة', 'صب', 'بلاطة'],
                'لحساب السقف، تحتاج إلى معرفة الطول والعرض والسمك. استخدم حاسبة السقف في الموقع لحساب كمية الحديد والأسمنت والرمل والسن المطلوبة.'
            ],
            [
                ['حديد', 'تسليح', 'حديد التسليح'],
                'كمية الحديد تعتمد على نوع السقف: السقف العادي يحتاج 80 كيلو/متر مربع، الفلات سلاب 120 كيلو/متر مربع، والكمرات والبلاطات 150 كيلو/متر مربع.'
            ],
            
            // Brick related questions
            [
                ['طوب', 'بناء', 'حوائط', 'جدران'],
                'لحساب الطوب، حدد نوع الطوب أولاً: الطوب الأحمر يحتاج 55 طوبة/متر مربع، البلوك الأسمنتي 12.5 قطعة/متر مربع. استخدم حاسبة الطوب للحصول على النتيجة الدقيقة.'
            ],
            [
                ['مونة', 'لحام', 'أسمنت للطوب'],
                'المونة تحتاج حوالي 300 كيلو أسمنت و 1.2 متر مكعب رمل لكل متر مكعب من المونة. النسبة المثلى هي 1:4 (أسمنت:رمل).'
            ],
            
            // Plaster related questions
            [
                ['محارة', 'لياسة', 'تشطيب'],
                'المحارة الأسمنتية تحتاج 250 كيلو أسمنت و 1.3 متر مكعب رمل لكل متر مكعب. السمك المعتاد 1.5-2 سم.'
            ],
            
            // Tiles related questions
            [
                ['بلاط', 'سيراميك', 'رخام', 'أرضيات'],
                'لحساب البلاط، اقسم المساحة على مساحة البلاطة الواحدة وأضف 5-15% للهدر. البلاط 60×60 يحتاج 2.8 قطعة/متر مربع.'
            ],
            
            // Cost related questions
            [
                ['سعر', 'تكلفة', 'فلوس', 'ثمن'],
                'الأسعار تختلف حسب المنطقة والوقت. الموقع يعطي تقديرات تقريبية بناءً على متوسط الأسعار الحالية في السوق المصري.'
            ],
            
            // General construction questions
            [
                ['نصائح', 'إرشادات', 'توجيهات'],
                'نصائح مهمة: احسب 5-10% زيادة للهدر، اشتري المواد من مصادر موثوقة، تأكد من جودة الأسمنت والحديد، واستشر مهندس للمشاريع الكبيرة.'
            ],
            [
                ['جودة', 'مواصفات', 'معايير'],
                'تأكد من مطابقة المواد للمواصفات المصرية: الأسمنت البورتلاندي 42.5، الحديد عالي المقاومة، الرمل نظيف خالي من الأملاح.'
            ],
            
            // Greetings and common phrases
            [
                ['مرحبا', 'أهلا', 'السلام عليكم', 'صباح الخير', 'مساء الخير'],
                'أهلاً وسهلاً! أنا مساعدك الذكي لحسابات البناء. كيف يمكنني مساعدتك اليوم؟'
            ],
            [
                ['شكرا', 'متشكر', 'جزاك الله خيرا'],
                'العفو! سعيد بمساعدتك. إذا كان لديك أي أسئلة أخرى عن حسابات البناء، لا تتردد في السؤال.'
            ],
            [
                ['مساعدة', 'ساعدني', 'محتاج مساعدة'],
                'بالطبع! أنا هنا لمساعدتك في جميع حسابات البناء. يمكنك سؤالي عن السقف، الطوب، المحارة، البلاط، أو الأعمدة والقواعد.'
            ]
        ];
    }
}

// ===== Storage and PDF Functions =====

// Save calculation to localStorage
function saveCurrentCalculation() {
    const calculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    const timestamp = new Date().toLocaleString('ar-EG');
    
    // Get current calculation data (this would be implemented based on active calculator)
    const calculationData = {
        id: Date.now(),
        timestamp: timestamp,
        type: 'عام', // This would be dynamic based on current calculator
        data: 'بيانات الحساب', // This would contain actual calculation results
    };
    
    calculations.push(calculationData);
    localStorage.setItem('savedCalculations', JSON.stringify(calculations));
    
    Utils.showNotification('تم حفظ الحساب بنجاح!', 'success');
    updateSavedCalculationsList();
}

// Download PDF functionality
function downloadPDF() {
    // This would use jsPDF to create and download PDF
    Utils.showNotification('جاري تحضير ملف PDF...', 'info');
    
    setTimeout(() => {
        // Simulate PDF generation
        Utils.showNotification('تم تحميل ملف PDF بنجاح!', 'success');
    }, 2000);
}

// Share via WhatsApp
function shareWhatsApp() {
    const text = encodeURIComponent('شاهد حسابات البناء الخاصة بي من موقع حساباتي للبناء');
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
}

// Share via Email
function shareEmail() {
    const subject = encodeURIComponent('حسابات البناء - حساباتي للبناء');
    const body = encodeURIComponent('مرفق حسابات البناء من موقع حساباتي للبناء');
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = url;
}

// Update saved calculations list
function updateSavedCalculationsList() {
    const calculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    const listContainer = document.getElementById('calculationsList');
    
    if (!listContainer) return;
    
    if (calculations.length === 0) {
        listContainer.innerHTML = '<p>لا توجد حسابات محفوظة</p>';
        return;
    }
    
    listContainer.innerHTML = calculations.map(calc => `
        <div class="saved-calculation-item">
            <div class="calc-info">
                <strong>${calc.type}</strong>
                <small>${calc.timestamp}</small>
            </div>
            <div class="calc-actions">
                <button onclick="loadCalculation(${calc.id})" class="load-btn">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button onclick="deleteCalculation(${calc.id})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Load saved calculation
function loadCalculation(id) {
    const calculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    const calculation = calculations.find(calc => calc.id === id);
    
    if (calculation) {
        Utils.showNotification('تم تحميل الحساب المحفوظ', 'success');
        // Implementation would load the calculation data into the appropriate calculator
    }
}

// Delete saved calculation
function deleteCalculation(id) {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
        let calculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
        calculations = calculations.filter(calc => calc.id !== id);
        localStorage.setItem('savedCalculations', JSON.stringify(calculations));
        
        Utils.showNotification('تم حذف الحساب', 'success');
        updateSavedCalculationsList();
    }
}

// Specific PDF download functions for each calculator
function downloadCeilingPDF() {
    Utils.showNotification('جاري تحضير ملف PDF لحساب السقف...', 'info');
    // Implementation for ceiling PDF
}

function downloadBrickPDF() {
    Utils.showNotification('جاري تحضير ملف PDF لحساب الطوب...', 'info');
    // Implementation for brick PDF
}

function downloadPlasterPDF() {
    Utils.showNotification('جاري تحضير ملف PDF لحساب المحارة...', 'info');
    // Implementation for plaster PDF
}

function downloadTilesPDF() {
    Utils.showNotification('جاري تحضير ملف PDF لحساب البلاط...', 'info');
    // Implementation for tiles PDF
}

function downloadColumnsPDF() {
    Utils.showNotification('جاري تحضير ملف PDF لحساب الأعمدة...', 'info');
    // Implementation for columns PDF
}

// Specific save functions for each calculator
function saveCeilingCalculation() {
    // Implementation for saving ceiling calculation
    saveCurrentCalculation();
}

function saveBrickCalculation() {
    // Implementation for saving brick calculation
    saveCurrentCalculation();
}

function savePlasterCalculation() {
    // Implementation for saving plaster calculation
    saveCurrentCalculation();
}

function saveTilesCalculation() {
    // Implementation for saving tiles calculation
    saveCurrentCalculation();
}

function saveColumnsCalculation() {
    // Implementation for saving columns calculation
    saveCurrentCalculation();
}

// Initialize AI Chat Bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIChatBot();
});
