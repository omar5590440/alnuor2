// ===== Main JavaScript File =====

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const calculatorCards = document.querySelectorAll('.calculator-card');
const modal = document.getElementById('calculatorModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// ===== Theme Management =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    bindEvents() {
        themeToggle?.addEventListener('click', () => this.toggleTheme());
    }
}

// ===== Modal Management =====
class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    open(title, content) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add animation
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    }

    close() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    bindEvents() {
        closeModal?.addEventListener('click', () => this.close());
        
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.close();
            }
        });
    }
}

// ===== Navigation Management =====
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleActiveLinks();
    }

    bindEvents() {
        // Mobile menu toggle
        mobileMenuToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ===== Calculator Manager =====
class CalculatorManager {
    constructor() {
        this.modalManager = new ModalManager();
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        calculatorCards.forEach(card => {
            const button = card.querySelector('.card-button');
            button?.addEventListener('click', () => {
                const calculatorType = card.getAttribute('data-calculator');
                this.openCalculator(calculatorType);
            });
        });
    }

    openCalculator(type) {
        const calculatorData = this.getCalculatorData(type);
        this.modalManager.open(calculatorData.title, calculatorData.content);
    }

    getCalculatorData(type) {
        const calculators = {
            ceiling: {
                title: 'حاسبة السقف',
                content: this.getCeilingCalculatorHTML()
            },
            brick: {
                title: 'حاسبة الطوب',
                content: this.getBrickCalculatorHTML()
            },
            plaster: {
                title: 'حاسبة المحارة',
                content: this.getPlasterCalculatorHTML()
            },
            tiles: {
                title: 'حاسبة البلاط',
                content: this.getTilesCalculatorHTML()
            },
            columns: {
                title: 'حاسبة الأعمدة والقواعد',
                content: this.getColumnsCalculatorHTML()
            },
            storage: {
                title: 'التخزين والتحميل',
                content: this.getStorageHTML()
            }
        };

        return calculators[type] || { title: 'حاسبة', content: '<p>قريباً...</p>' };
    }

    getCeilingCalculatorHTML() {
        return `
            <div class="calculator-form">
                <h4>أدخل أبعاد السقف</h4>
                <div class="form-group">
                    <label>الطول (متر):</label>
                    <input type="number" id="ceilingLength" placeholder="مثال: 4" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>العرض (متر):</label>
                    <input type="number" id="ceilingWidth" placeholder="مثال: 3" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>السمك (سم):</label>
                    <input type="number" id="ceilingThickness" placeholder="مثال: 15" min="0" step="1">
                </div>
                <div class="form-group">
                    <label>نوع السقف:</label>
                    <select id="ceilingType">
                        <option value="normal">سقف عادي</option>
                        <option value="flat">فلات سلاب</option>
                        <option value="beams">كمرات وبلاطات</option>
                    </select>
                </div>
                <button class="calculate-btn" onclick="calculateCeiling()">
                    <i class="fas fa-calculator"></i>
                    احسب المواد
                </button>
                <div id="ceilingResults" class="results-section"></div>
            </div>
        `;
    }

    getBrickCalculatorHTML() {
        return `
            <div class="calculator-form">
                <h4>أدخل مساحة الحوائط</h4>
                <div class="form-group">
                    <label>المساحة الإجمالية (متر مربع):</label>
                    <input type="number" id="wallArea" placeholder="مثال: 50" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>نوع الطوب:</label>
                    <select id="brickType">
                        <option value="red">طوب أحمر (25×12×6)</option>
                        <option value="block">بلوك أسمنتي (20×20×40)</option>
                        <option value="hollow">طوب مفرغ (15×20×40)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>سمك الحائط (سم):</label>
                    <select id="wallThickness">
                        <option value="12">12 سم</option>
                        <option value="15">15 سم</option>
                        <option value="20">20 سم</option>
                        <option value="25">25 سم</option>
                    </select>
                </div>
                <button class="calculate-btn" onclick="calculateBrick()">
                    <i class="fas fa-calculator"></i>
                    احسب الطوب
                </button>
                <div id="brickResults" class="results-section"></div>
            </div>
        `;
    }

    getPlasterCalculatorHTML() {
        return `
            <div class="calculator-form">
                <h4>أدخل مساحة المحارة</h4>
                <div class="form-group">
                    <label>مساحة الحوائط (متر مربع):</label>
                    <input type="number" id="plasterArea" placeholder="مثال: 100" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>سمك المحارة:</label>
                    <select id="plasterThickness">
                        <option value="1.5">1.5 سم</option>
                        <option value="2">2 سم</option>
                        <option value="2.5">2.5 سم</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>نوع المحارة:</label>
                    <select id="plasterType">
                        <option value="cement">محارة أسمنتية</option>
                        <option value="gypsum">محارة جبسية</option>
                        <option value="lime">محارة جيرية</option>
                    </select>
                </div>
                <button class="calculate-btn" onclick="calculatePlaster()">
                    <i class="fas fa-calculator"></i>
                    احسب المحارة
                </button>
                <div id="plasterResults" class="results-section"></div>
            </div>
        `;
    }

    getTilesCalculatorHTML() {
        return `
            <div class="calculator-form">
                <h4>أدخل مساحة البلاط</h4>
                <div class="form-group">
                    <label>المساحة (متر مربع):</label>
                    <input type="number" id="tilesArea" placeholder="مثال: 30" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>مقاس البلاط:</label>
                    <select id="tileSize">
                        <option value="60x60">60×60 سم</option>
                        <option value="50x50">50×50 سم</option>
                        <option value="40x40">40×40 سم</option>
                        <option value="30x30">30×30 سم</option>
                        <option value="20x20">20×20 سم</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>نسبة الهدر (%):</label>
                    <select id="wastePercentage">
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>طريقة التركيب:</label>
                    <select id="installMethod">
                        <option value="adhesive">لاصق</option>
                        <option value="mortar">مونة أسمنتية</option>
                    </select>
                </div>
                <button class="calculate-btn" onclick="calculateTiles()">
                    <i class="fas fa-calculator"></i>
                    احسب البلاط
                </button>
                <div id="tilesResults" class="results-section"></div>
            </div>
        `;
    }

    getColumnsCalculatorHTML() {
        return `
            <div class="calculator-form">
                <h4>حساب الأعمدة والقواعد</h4>
                <div class="form-group">
                    <label>نوع العنصر:</label>
                    <select id="elementType">
                        <option value="column">عمود</option>
                        <option value="foundation">قاعدة</option>
                        <option value="beam">كمرة</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الطول (متر):</label>
                    <input type="number" id="elementLength" placeholder="مثال: 3" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>العرض (متر):</label>
                    <input type="number" id="elementWidth" placeholder="مثال: 0.3" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>الارتفاع (متر):</label>
                    <input type="number" id="elementHeight" placeholder="مثال: 0.3" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>عدد القطع:</label>
                    <input type="number" id="elementCount" placeholder="مثال: 4" min="1" step="1" value="1">
                </div>
                <button class="calculate-btn" onclick="calculateColumns()">
                    <i class="fas fa-calculator"></i>
                    احسب المواد
                </button>
                <div id="columnsResults" class="results-section"></div>
            </div>
        `;
    }

    getStorageHTML() {
        return `
            <div class="storage-section">
                <h4>إدارة الحسابات المحفوظة</h4>
                <div class="storage-actions">
                    <button class="action-btn" onclick="saveCurrentCalculation()">
                        <i class="fas fa-save"></i>
                        حفظ الحساب الحالي
                    </button>
                    <button class="action-btn" onclick="downloadPDF()">
                        <i class="fas fa-file-pdf"></i>
                        تحميل PDF
                    </button>
                    <button class="action-btn" onclick="shareWhatsApp()">
                        <i class="fab fa-whatsapp"></i>
                        مشاركة واتساب
                    </button>
                    <button class="action-btn" onclick="shareEmail()">
                        <i class="fas fa-envelope"></i>
                        إرسال إيميل
                    </button>
                </div>
                <div id="savedCalculations" class="saved-calculations">
                    <h5>الحسابات المحفوظة:</h5>
                    <div id="calculationsList"></div>
                </div>
            </div>
        `;
    }
}

// ===== Utility Functions =====
class Utils {
    static formatNumber(num) {
        return new Intl.NumberFormat('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    static validateInput(value, min = 0, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }
}

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    new ThemeManager();
    new NavigationManager();
    new CalculatorManager();
    
    // Add fade-in animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe calculator cards
    calculatorCards.forEach(card => {
        observer.observe(card);
    });
    
    console.log('🏗️ حساباتي للبناء - تم تحميل الموقع بنجاح!');
});
