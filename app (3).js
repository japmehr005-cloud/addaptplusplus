// AI Marketing Platform - Enterprise JavaScript Application
class AIMarketingPlatform {
    constructor() {
        this.currentSection = 'dashboard';
        this.wizardStep = 1;
        this.campaigns = [];
        this.assets = [];
        this.audiences = [];
        this.nlpModels = {
            sentiment: 'distilbert-base-uncased-finetuned-sst-2-english',
            ner: 'dbmdz/bert-large-cased-finetuned-conll03-english',
            intent: 'microsoft/DialoGPT-medium'
        };
        this.charts = {};
        this.realTimeInterval = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        // Hide loading overlay immediately
        this.hideLoading();
        
        this.setupEventListeners();
        this.initializeTheme();
        this.generateSampleData();
        this.loadDashboard();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Campaign wizard
        this.setupCampaignWizard();
        
        // File upload
        this.setupFileUpload();
        
        // Audience builder
        this.setupAudienceBuilder();
        
        // Creative studio
        this.setupCreativeStudio();
        
        // Export functionality
        const exportBtn = document.getElementById('exportReportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportReport();
            });
        }
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        this.showToast('success', 'Theme Updated', `Switched to ${newTheme} mode`);
    }

    updateThemeIcon(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        }
    }

    navigateToSection(section) {
        console.log('Navigating to section:', section);
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`[data-section="${section}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update content sections
        document.querySelectorAll('.content-section').forEach(contentSection => {
            contentSection.classList.remove('active');
        });
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSection = section;

        // Load section-specific content with small delay to ensure DOM is ready
        setTimeout(() => {
            switch(section) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                case 'campaigns':
                    this.loadCampaigns();
                    break;
                case 'assets':
                    this.loadAssets();
                    break;
                case 'audience':
                    this.loadAudience();
                    break;
                case 'creative':
                    this.loadCreative();
                    break;
                case 'analytics':
                    this.loadAnalytics();
                    break;
            }
        }, 50);
    }

    // Dashboard functionality
    loadDashboard() {
        console.log('Loading dashboard...');
        this.updateKPIs();
        setTimeout(() => {
            this.initializeCharts();
        }, 200);
        this.loadRecentActivity();
    }

    updateKPIs() {
        const kpis = {
            totalRevenue: 284750,
            activeCampaigns: 12,
            avgCTR: 3.24,
            roas: 4.2
        };

        // Animate KPI values
        this.animateValue('totalRevenue', 0, kpis.totalRevenue, 2000, (val) => `$${val.toLocaleString()}`);
        this.animateValue('activeCampaigns', 0, kpis.activeCampaigns, 1500);
        this.animateValue('avgCTR', 0, kpis.avgCTR, 1800, (val) => `${val.toFixed(2)}%`);
        this.animateValue('roas', 0, kpis.roas, 2200, (val) => `${val.toFixed(1)}x`);

        // Update change indicators
        setTimeout(() => {
            const revenueChange = document.getElementById('revenueChange');
            const campaignsChange = document.getElementById('campaignsChange');
            const ctrChange = document.getElementById('ctrChange');
            const roasChange = document.getElementById('roasChange');
            
            if (revenueChange) revenueChange.textContent = '+12.5%';
            if (campaignsChange) campaignsChange.textContent = '+3';
            if (ctrChange) ctrChange.textContent = '+0.8%';
            if (roasChange) roasChange.textContent = '+15%';
        }, 500);
    }

    animateValue(elementId, start, end, duration, formatter = (val) => val) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOutCubic;
            
            element.textContent = formatter(Math.floor(current));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    initializeCharts() {
        // Performance Chart
        const performanceCanvas = document.getElementById('performanceChart');
        if (!performanceCanvas) return;
        
        try {
            const performanceCtx = performanceCanvas.getContext('2d');
            if (this.charts.performance) this.charts.performance.destroy();
            
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Conversions',
                        data: [300, 450, 320, 580, 520, 680, 650],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(167, 169, 169, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(167, 169, 169, 0.1)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating performance chart:', error);
        }

        // Funnel Chart
        const funnelCanvas = document.getElementById('funnelChart');
        if (!funnelCanvas) return;
        
        try {
            const funnelCtx = funnelCanvas.getContext('2d');
            if (this.charts.funnel) this.charts.funnel.destroy();
            
            this.charts.funnel = new Chart(funnelCtx, {
                type: 'bar',
                data: {
                    labels: ['Impressions', 'Clicks', 'Leads', 'Conversions'],
                    datasets: [{
                        label: 'Funnel Metrics',
                        data: [100000, 8500, 2400, 680],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(167, 169, 169, 0.1)'
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating funnel chart:', error);
        }
    }

    loadRecentActivity() {
        const activities = [
            { icon: '🚀', title: 'Campaign "Summer Sale" launched', time: '2 minutes ago' },
            { icon: '📊', title: 'Monthly report generated', time: '15 minutes ago' },
            { icon: '🎯', title: 'New audience segment created', time: '1 hour ago' },
            { icon: '💡', title: 'AI optimization applied to "Brand Awareness"', time: '2 hours ago' },
            { icon: '📈', title: 'Conversion rate increased by 12%', time: '4 hours ago' }
        ];

        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <span>${activity.icon}</span>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    startRealTimeUpdates() {
        this.realTimeInterval = setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.updateRealTimeMetrics();
            }
        }, 5000);
    }

    updateRealTimeMetrics() {
        // Simulate real-time updates
        const elements = ['totalRevenue', 'activeCampaigns', 'avgCTR', 'roas'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element && Math.random() > 0.7) {
                element.style.transform = 'scale(1.05)';
                element.style.color = 'var(--color-primary)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.color = 'var(--color-text)';
                }, 300);
            }
        });
    }

    // Campaign Management
    setupCampaignWizard() {
        const createCampaignBtn = document.getElementById('createCampaignBtn');
        if (createCampaignBtn) {
            createCampaignBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Create campaign button clicked');
                this.showCampaignWizard();
            });
        }

        // Also handle the main dashboard create campaign button
        const mainCreateBtn = document.querySelector('.section-header .btn--primary');
        if (mainCreateBtn) {
            mainCreateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Main create campaign button clicked');
                // Navigate to campaigns section and show wizard
                this.navigateToSection('campaigns');
                setTimeout(() => {
                    this.showCampaignWizard();
                }, 100);
            });
        }

        // NLP Analysis
        const campaignDescription = document.getElementById('campaignDescription');
        if (campaignDescription) {
            campaignDescription.addEventListener('input', (e) => {
                this.performNLPAnalysis(e.target.value);
            });
        }

        // Wizard navigation
        const wizardNext = document.getElementById('wizardNext');
        if (wizardNext) {
            wizardNext.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextWizardStep();
            });
        }

        const wizardPrev = document.getElementById('wizardPrev');
        if (wizardPrev) {
            wizardPrev.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.prevWizardStep();
            });
        }

        const deployCampaign = document.getElementById('deployCampaign');
        if (deployCampaign) {
            deployCampaign.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deployCampaign();
            });
        }
    }

    showCampaignWizard() {
        console.log('Showing campaign wizard');
        const wizard = document.getElementById('campaignWizard');
        const campaignsList = document.getElementById('campaignsList');
        
        if (wizard) {
            wizard.classList.remove('hidden');
            console.log('Wizard shown');
        }
        if (campaignsList) {
            campaignsList.classList.add('hidden');
            console.log('Campaigns list hidden');
        }
        
        this.wizardStep = 1;
        this.updateWizardStep();
    }

    async performNLPAnalysis(text) {
        if (text.length < 10) {
            const nlpAnalysis = document.getElementById('nlpAnalysis');
            if (nlpAnalysis) {
                nlpAnalysis.style.display = 'none';
            }
            return;
        }

        // Simulate NLP processing time
        setTimeout(() => {
            const analysis = this.simulateNLPAnalysis(text);
            this.displayNLPResults(analysis);
        }, 800);
    }

    simulateNLPAnalysis(text) {
        // Simulate advanced NLP analysis
        const words = text.toLowerCase().split(/\s+/);
        
        // Named Entity Recognition simulation
        const entities = this.extractEntities(words);
        
        // Intent Classification
        const intent = this.classifyIntent(text);
        
        // Sentiment Analysis
        const sentiment = this.analyzeSentiment(text);
        
        return { entities, intent, sentiment };
    }

    extractEntities(words) {
        const locationKeywords = ['new york', 'california', 'london', 'tokyo', 'global', 'nationwide'];
        const amountKeywords = ['$', 'budget', 'cost', 'price', 'dollars'];
        const timeKeywords = ['today', 'tomorrow', 'week', 'month', 'year', 'daily'];
        
        const entities = [];
        
        locationKeywords.forEach(keyword => {
            if (words.some(word => word.includes(keyword.replace(' ', '')))) {
                entities.push({ type: 'LOCATION', value: keyword });
            }
        });
        
        amountKeywords.forEach(keyword => {
            if (words.includes(keyword)) {
                entities.push({ type: 'MONEY', value: keyword });
            }
        });
        
        timeKeywords.forEach(keyword => {
            if (words.includes(keyword)) {
                entities.push({ type: 'DATE', value: keyword });
            }
        });
        
        return entities;
    }

    classifyIntent(text) {
        const intents = {
            'brand_awareness': ['brand', 'awareness', 'recognition', 'visibility'],
            'lead_generation': ['lead', 'leads', 'contact', 'signup', 'subscribe'],
            'conversions': ['convert', 'sale', 'purchase', 'buy', 'conversion'],
            'traffic': ['traffic', 'visit', 'website', 'click'],
            'engagement': ['engage', 'like', 'share', 'comment', 'interaction']
        };
        
        let maxScore = 0;
        let detectedIntent = 'brand_awareness';
        
        Object.entries(intents).forEach(([intent, keywords]) => {
            const score = keywords.filter(keyword => 
                text.toLowerCase().includes(keyword)
            ).length;
            
            if (score > maxScore) {
                maxScore = score;
                detectedIntent = intent;
            }
        });
        
        return {
            intent: detectedIntent,
            confidence: Math.min(0.95, 0.3 + maxScore * 0.2)
        };
    }

    analyzeSentiment(text) {
        const positiveWords = ['great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'perfect'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing'];
        
        const words = text.toLowerCase().split(/\s+/);
        let positiveScore = 0;
        let negativeScore = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) positiveScore++;
            if (negativeWords.includes(word)) negativeScore++;
        });
        
        const totalScore = positiveScore - negativeScore;
        
        if (totalScore > 0) {
            return { label: 'POSITIVE', score: Math.min(0.95, 0.6 + totalScore * 0.1) };
        } else if (totalScore < 0) {
            return { label: 'NEGATIVE', score: Math.min(0.95, 0.6 + Math.abs(totalScore) * 0.1) };
        } else {
            return { label: 'NEUTRAL', score: 0.5 };
        }
    }

    displayNLPResults(analysis) {
        const nlpAnalysis = document.getElementById('nlpAnalysis');
        if (!nlpAnalysis) return;
        
        let html = '<h4>AI Analysis Results:</h4>';
        
        // Sentiment
        html += `<div class="nlp-result">
            <strong>Sentiment:</strong> ${analysis.sentiment.label} 
            (${(analysis.sentiment.score * 100).toFixed(1)}%)
        </div>`;
        
        // Intent
        html += `<div class="nlp-result">
            <strong>Detected Intent:</strong> ${analysis.intent.intent.replace('_', ' ').toUpperCase()} 
            (${(analysis.intent.confidence * 100).toFixed(1)}% confidence)
        </div>`;
        
        // Entities
        if (analysis.entities.length > 0) {
            html += '<div class="nlp-result"><strong>Entities:</strong> ';
            html += analysis.entities.map(entity => 
                `<span class="nlp-tag">${entity.type}: ${entity.value}</span>`
            ).join(' ');
            html += '</div>';
        }
        
        nlpAnalysis.innerHTML = html;
        nlpAnalysis.style.display = 'block';
    }

    nextWizardStep() {
        if (this.wizardStep < 3) {
            this.wizardStep++;
            this.updateWizardStep();
            
            if (this.wizardStep === 2) {
                this.generateAIInsights();
            }
            
            if (this.wizardStep === 3) {
                this.generateCampaignSummary();
                const wizardNext = document.getElementById('wizardNext');
                const deployCampaign = document.getElementById('deployCampaign');
                if (wizardNext) wizardNext.classList.add('hidden');
                if (deployCampaign) deployCampaign.classList.remove('hidden');
            }
        }
    }

    prevWizardStep() {
        if (this.wizardStep > 1) {
            this.wizardStep--;
            this.updateWizardStep();
            
            if (this.wizardStep < 3) {
                const wizardNext = document.getElementById('wizardNext');
                const deployCampaign = document.getElementById('deployCampaign');
                if (wizardNext) wizardNext.classList.remove('hidden');
                if (deployCampaign) deployCampaign.classList.add('hidden');
            }
        }
    }

    updateWizardStep() {
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= this.wizardStep);
        });
        
        // Update step content
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.wizardStep);
        });
    }

    generateAIInsights() {
        const insights = {
            audienceSuggestions: [
                'Tech-savvy millennials (25-35)',
                'Small business owners',
                'Digital marketing professionals',
                'E-commerce entrepreneurs'
            ],
            optimizationTips: [
                'Use action-oriented CTAs for better conversion',
                'Target mobile users during evening hours',
                'A/B test different ad creatives',
                'Implement retargeting campaigns'
            ]
        };
        
        const audienceSuggestions = document.getElementById('audienceSuggestions');
        if (audienceSuggestions) {
            audienceSuggestions.innerHTML = insights.audienceSuggestions.map(suggestion => 
                `<div class="suggestion-item">${suggestion}</div>`
            ).join('');
        }
        
        const optimizationTips = document.getElementById('optimizationTips');
        if (optimizationTips) {
            optimizationTips.innerHTML = insights.optimizationTips.map(tip => 
                `<div class="tip-item">💡 ${tip}</div>`
            ).join('');
        }
    }

    generateCampaignSummary() {
        const formData = {
            name: document.getElementById('campaignName')?.value || 'New Campaign',
            platform: document.getElementById('campaignPlatform')?.value || 'Meta Ads',
            objective: document.getElementById('campaignObjective')?.value || 'Brand Awareness',
            budget: document.getElementById('campaignBudget')?.value || '100',
            description: document.getElementById('campaignDescription')?.value || 'Campaign description'
        };
        
        const summary = document.getElementById('campaignSummary');
        if (summary) {
            summary.innerHTML = `
                <div class="campaign-summary-card">
                    <h3>${formData.name}</h3>
                    <div class="summary-details">
                        <div class="detail-item">
                            <strong>Platform:</strong> ${formData.platform}
                        </div>
                        <div class="detail-item">
                            <strong>Objective:</strong> ${formData.objective}
                        </div>
                        <div class="detail-item">
                            <strong>Daily Budget:</strong> $${formData.budget}
                        </div>
                        <div class="detail-item">
                            <strong>Description:</strong> ${formData.description.substring(0, 100)}${formData.description.length > 100 ? '...' : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    deployCampaign() {
        this.showLoading();
        
        setTimeout(() => {
            const campaignData = {
                id: Date.now(),
                name: document.getElementById('campaignName')?.value || 'New Campaign',
                platform: document.getElementById('campaignPlatform')?.value || 'Meta Ads',
                objective: document.getElementById('campaignObjective')?.value || 'Brand Awareness',
                budget: document.getElementById('campaignBudget')?.value || '100',
                status: 'active',
                impressions: Math.floor(Math.random() * 50000) + 10000,
                clicks: Math.floor(Math.random() * 2000) + 500,
                conversions: Math.floor(Math.random() * 100) + 20
            };
            
            this.campaigns.push(campaignData);
            this.hideLoading();
            
            const wizard = document.getElementById('campaignWizard');
            const campaignsList = document.getElementById('campaignsList');
            if (wizard) wizard.classList.add('hidden');
            if (campaignsList) campaignsList.classList.remove('hidden');
            
            this.loadCampaigns();
            this.showToast('success', 'Campaign Deployed', 'Your campaign is now live!');
            
            // Reset wizard
            this.wizardStep = 1;
            this.updateWizardStep();
            const wizardNext = document.getElementById('wizardNext');
            const deployCampaign = document.getElementById('deployCampaign');
            if (wizardNext) wizardNext.classList.remove('hidden');
            if (deployCampaign) deployCampaign.classList.add('hidden');
            
            // Clear form
            const form = document.querySelector('#step1');
            if (form) {
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => input.value = '');
            }
        }, 2000);
    }

    loadCampaigns() {
        console.log('Loading campaigns...');
        const campaignsGrid = document.getElementById('campaignsGrid');
        if (!campaignsGrid) return;
        
        if (this.campaigns.length === 0) {
            campaignsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No campaigns yet</h3>
                    <p>Create your first campaign to get started</p>
                </div>
            `;
            return;
        }
        
        campaignsGrid.innerHTML = this.campaigns.map(campaign => `
            <div class="campaign-card">
                <div class="campaign-header">
                    <div>
                        <h3 class="campaign-title">${campaign.name}</h3>
                        <p class="campaign-platform">${campaign.platform}</p>
                    </div>
                    <span class="campaign-status ${campaign.status}">${campaign.status}</span>
                </div>
                <div class="campaign-metrics">
                    <div class="metric-item">
                        <div class="metric-value">${campaign.impressions.toLocaleString()}</div>
                        <div class="metric-label">Impressions</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${campaign.clicks.toLocaleString()}</div>
                        <div class="metric-label">Clicks</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${campaign.conversions}</div>
                        <div class="metric-label">Conversions</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // File Upload System
    setupFileUpload() {
        const uploadBtn = document.getElementById('uploadAssetBtn');
        const bulkUploadBtn = document.getElementById('bulkUploadBtn');
        const uploadInterface = document.getElementById('uploadInterface');
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (uploadInterface) uploadInterface.classList.remove('hidden');
            });
        }
        
        if (bulkUploadBtn) {
            bulkUploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (uploadInterface) uploadInterface.classList.remove('hidden');
            });
        }
        
        if (uploadZone) {
            uploadZone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (fileInput) fileInput.click();
            });
            
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        const uploadProgress = document.getElementById('uploadProgress');
        const progressList = document.getElementById('progressList');
        
        if (uploadProgress) uploadProgress.classList.remove('hidden');
        if (progressList) progressList.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            this.uploadFile(file, progressList);
        });
    }

    uploadFile(file, container) {
        if (!container) return;
        
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        
        progressItem.innerHTML = `
            <div class="file-info">
                <strong>${file.name}</strong>
                <span>${this.formatFileSize(file.size)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-text">0%</span>
        `;
        
        container.appendChild(progressItem);
        
        // Simulate upload progress
        let progress = 0;
        const progressFill = progressItem.querySelector('.progress-fill');
        const progressText = progressItem.querySelector('.progress-text');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Add to assets
                this.assets.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    uploadDate: new Date()
                });
                
                this.showToast('success', 'Upload Complete', `${file.name} uploaded successfully`);
            }
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.floor(progress)}%`;
        }, 200);
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    loadAssets() {
        console.log('Loading assets...');
        const assetsGrid = document.getElementById('assetsGrid');
        if (!assetsGrid) return;
        
        if (this.assets.length === 0) {
            assetsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No assets uploaded</h3>
                    <p>Upload your first asset to get started</p>
                </div>
            `;
            return;
        }
        
        assetsGrid.innerHTML = this.assets.map(asset => `
            <div class="asset-card">
                <div class="asset-preview">
                    ${asset.type.startsWith('image/') ? 
                        `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1FB8CD, #FFC185); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">IMG</div>` :
                        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>`
                    }
                </div>
                <div class="asset-info">
                    <h4 class="asset-name">${asset.name}</h4>
                    <p class="asset-meta">${this.formatFileSize(asset.size)} • ${asset.type}</p>
                </div>
            </div>
        `).join('');
    }

    // Audience Builder
    setupAudienceBuilder() {
        const addFilterBtn = document.getElementById('addFilterBtn');
        const createAudienceBtn = document.getElementById('createAudienceBtn');
        
        if (addFilterBtn) {
            addFilterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addAudienceFilter();
            });
        }
        
        if (createAudienceBtn) {
            createAudienceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.createAudience();
            });
        }
    }

    loadAudience() {
        console.log('Loading audience...');
        this.loadAudienceFilters();
    }

    loadAudienceFilters() {
        const filterGroups = document.getElementById('filterGroups');
        if (!filterGroups) return;
        
        // Default filters
        const defaultFilters = [
            { type: 'Age', options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
            { type: 'Gender', options: ['Male', 'Female', 'All'] },
            { type: 'Location', options: ['United States', 'Canada', 'United Kingdom', 'Global'] }
        ];
        
        filterGroups.innerHTML = defaultFilters.map((filter, index) => `
            <div class="filter-group">
                <div class="filter-header">
                    <span class="filter-title">${filter.type}</span>
                    <button class="remove-filter" onclick="this.parentElement.parentElement.remove(); window.aiPlatform.updateAudienceEstimate()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <select class="form-control" onchange="window.aiPlatform.updateAudienceEstimate()">
                    ${filter.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
            </div>
        `).join('');
        
        this.updateAudienceEstimate();
    }

    addAudienceFilter() {
        const filterTypes = ['Interests', 'Behaviors', 'Income', 'Education', 'Device'];
        const randomType = filterTypes[Math.floor(Math.random() * filterTypes.length)];
        
        const filterGroups = document.getElementById('filterGroups');
        if (!filterGroups) return;
        
        const newFilter = document.createElement('div');
        newFilter.className = 'filter-group';
        newFilter.innerHTML = `
            <div class="filter-header">
                <span class="filter-title">${randomType}</span>
                <button class="remove-filter" onclick="this.parentElement.parentElement.remove(); window.aiPlatform.updateAudienceEstimate()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <input type="text" class="form-control" placeholder="Enter ${randomType.toLowerCase()}..." 
                   onchange="window.aiPlatform.updateAudienceEstimate()">
        `;
        
        filterGroups.appendChild(newFilter);
        this.updateAudienceEstimate();
    }

    updateAudienceEstimate() {
        const filterCount = document.querySelectorAll('.filter-group').length;
        const baseSize = 10000000;
        const estimatedSize = Math.floor(baseSize / Math.pow(2, filterCount * 0.5));
        
        const estimatedSizeEl = document.getElementById('estimatedSize');
        if (estimatedSizeEl) {
            estimatedSizeEl.textContent = estimatedSize.toLocaleString();
        }
        
        let potential = 'High';
        if (estimatedSize < 100000) potential = 'Low';
        else if (estimatedSize < 1000000) potential = 'Medium';
        
        const reachPotentialEl = document.getElementById('reachPotential');
        if (reachPotentialEl) {
            reachPotentialEl.textContent = potential;
        }
    }

    createAudience() {
        const estimatedSizeEl = document.getElementById('estimatedSize');
        const reachPotentialEl = document.getElementById('reachPotential');
        
        const audienceData = {
            id: Date.now(),
            name: `Audience ${this.audiences.length + 1}`,
            size: estimatedSizeEl ? parseInt(estimatedSizeEl.textContent.replace(/,/g, '')) : 1000000,
            potential: reachPotentialEl ? reachPotentialEl.textContent : 'Medium',
            filters: Array.from(document.querySelectorAll('.filter-group')).map(group => ({
                type: group.querySelector('.filter-title').textContent,
                value: group.querySelector('select, input').value
            }))
        };
        
        this.audiences.push(audienceData);
        this.showToast('success', 'Audience Created', `New audience saved with ${audienceData.size.toLocaleString()} estimated reach`);
    }

    // Creative Studio
    setupCreativeStudio() {
        const generateCreativeBtn = document.getElementById('generateCreativeBtn');
        const generateBtn = document.getElementById('generateBtn');
        
        if (generateCreativeBtn) {
            generateCreativeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.generateCreative();
            });
        }
        
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.generateCreative();
            });
        }
    }

    generateCreative() {
        const promptEl = document.getElementById('creativePrompt');
        const styleEl = document.getElementById('creativeStyle');
        const formatEl = document.getElementById('creativeFormat');
        
        const prompt = promptEl ? promptEl.value : '';
        const style = styleEl ? styleEl.value : 'Modern';
        const format = formatEl ? formatEl.value : 'Square (1:1)';
        
        if (!prompt) {
            this.showToast('error', 'Missing Prompt', 'Please enter a creative prompt');
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            this.createCreativePreview(prompt, style, format);
            this.hideLoading();
            this.showToast('success', 'Creative Generated', 'AI has generated your creative asset');
        }, 3000);
    }

    createCreativePreview(prompt, style, format) {
        const gallery = document.getElementById('creativeGallery');
        if (!gallery) return;
        
        // Remove empty state if it exists
        const emptyState = gallery.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        const creative = document.createElement('div');
        creative.className = 'creative-item';
        creative.innerHTML = `
            <div class="creative-preview">
                <h4>${style} ${format}</h4>
                <p>"${prompt.substring(0, 50)}..."</p>
                <div class="creative-meta">
                    Generated by AI
                </div>
            </div>
        `;
        
        gallery.appendChild(creative);
    }

    loadCreative() {
        console.log('Loading creative...');
        // Initialize creative studio if needed
        const gallery = document.getElementById('creativeGallery');
        if (gallery && gallery.children.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <h3>No creatives generated</h3>
                    <p>Use AI to generate your first creative</p>
                </div>
            `;
        }
    }

    // Analytics
    loadAnalytics() {
        console.log('Loading analytics...');
        setTimeout(() => {
            this.initializeAnalyticsCharts();
        }, 200);
        this.generateCohortAnalysis();
    }

    initializeAnalyticsCharts() {
        // Trends Chart
        const trendsCanvas = document.getElementById('trendsChart');
        if (trendsCanvas) {
            try {
                const trendsCtx = trendsCanvas.getContext('2d');
                if (this.charts.trends) this.charts.trends.destroy();
                
                this.charts.trends = new Chart(trendsCtx, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [{
                            label: 'CTR',
                            data: [2.1, 2.8, 3.2, 3.5],
                            borderColor: '#1FB8CD',
                            tension: 0.4
                        }, {
                            label: 'ROAS',
                            data: [3.2, 3.8, 4.1, 4.5],
                            borderColor: '#FFC185',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            } catch (error) {
                console.error('Error creating trends chart:', error);
            }
        }

        // Attribution Chart
        const attributionCanvas = document.getElementById('attributionChart');
        if (attributionCanvas) {
            try {
                const attributionCtx = attributionCanvas.getContext('2d');
                if (this.charts.attribution) this.charts.attribution.destroy();
                
                this.charts.attribution = new Chart(attributionCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Direct', 'Social Media', 'Search', 'Email', 'Referral'],
                        datasets: [{
                            data: [30, 25, 20, 15, 10],
                            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            } catch (error) {
                console.error('Error creating attribution chart:', error);
            }
        }
    }

    generateCohortAnalysis() {
        const cohortHeatmap = document.getElementById('cohortHeatmap');
        if (!cohortHeatmap) return;
        
        const cohortData = [];
        
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const value = Math.random() * 100;
                const cell = document.createElement('div');
                cell.className = 'cohort-cell';
                cell.textContent = Math.floor(value);
                cell.style.opacity = value / 100;
                cohortData.push(cell);
            }
        }
        
        cohortHeatmap.innerHTML = '';
        cohortData.forEach(cell => cohortHeatmap.appendChild(cell));
    }

    // Export functionality
    exportReport() {
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            this.showToast('success', 'Report Exported', 'Your analytics report has been generated');
        }, 2000);
    }

    // Sample Data Generation
    generateSampleData() {
        // Generate sample campaigns
        const sampleCampaigns = [
            {
                id: 1,
                name: 'Summer Sale Campaign',
                platform: 'Meta Ads',
                objective: 'Conversions',
                budget: 150,
                status: 'active',
                impressions: 45000,
                clicks: 1200,
                conversions: 85
            },
            {
                id: 2,
                name: 'Brand Awareness Q3',
                platform: 'Google Ads',
                objective: 'Brand Awareness',
                budget: 200,
                status: 'active',
                impressions: 78000,
                clicks: 950,
                conversions: 42
            }
        ];
        
        this.campaigns.push(...sampleCampaigns);
        
        // Generate sample assets
        const sampleAssets = [
            {
                id: 1,
                name: 'hero-banner.jpg',
                size: 524288,
                type: 'image/jpeg',
                uploadDate: new Date()
            },
            {
                id: 2,
                name: 'product-video.mp4',
                size: 15728640,
                type: 'video/mp4',
                uploadDate: new Date()
            }
        ];
        
        this.assets.push(...sampleAssets);
    }

    // Utility functions
    showLoading() {
        if (this.isLoading) return;
        this.isLoading = true;
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    showToast(type, title, message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ';
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Initialize the application
let aiPlatform;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing AI Platform');
    aiPlatform = new AIMarketingPlatform();
    
    // Make it globally accessible for event handlers
    window.aiPlatform = aiPlatform;
});

// Handle browser theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', theme);
        if (window.aiPlatform) {
            window.aiPlatform.updateThemeIcon(theme);
        }
    }
});