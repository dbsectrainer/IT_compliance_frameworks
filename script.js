// Initialize interactive features
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();
    initializeAIImpactViewer();
    animateMetrics();
    initializeAutoScroll();
    initializeFrameworkFilters();
    initializeCostAnalysis();
    initializeGlobalCompliance();
    initializeTimeline();
    initializeEmergingTech();
    initializeMaturityModel();
});

// Framework filtering functionality
function initializeFrameworkFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const frameworkRows = document.querySelectorAll('.framework-table tbody tr');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filter table rows
            frameworkRows.forEach(row => {
                if (filter === 'all' || row.getAttribute('data-category') === filter) {
                    row.style.display = '';
                    // Add fade-in animation
                    row.style.animation = 'fadeIn 0.5s ease-in forwards';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // Initialize progress bars
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const progress = bar.style.getPropertyValue('--progress');
        bar.style.setProperty('--progress', progress);
    });
}

// Animate executive metrics
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            metric.style.opacity = '1';
            metric.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Auto-scroll functionality for GIF recording
function initializeAutoScroll() {
    let scrollPosition = 0;
    let isScrolling = false;
    let scrollInterval;
    const container = document.querySelector('.container');
    const scrollHeight = container.scrollHeight + 200; // More padding to ensure we capture everything
    const viewportHeight = window.innerHeight;
    scrollPosition = -50; // Start slightly above the top
    window.scrollTo(0, scrollPosition); // Ensure we start above the top

    // Create scroll control button
    const controlBtn = document.createElement('button');
    controlBtn.innerHTML = '<i class="fas fa-play"></i> Auto-Scroll';
    controlBtn.className = 'control-btn scroll-control';
    controlBtn.style.position = 'fixed';
    controlBtn.style.bottom = '20px';
    controlBtn.style.right = '20px';
    controlBtn.style.zIndex = '1000';
    document.body.appendChild(controlBtn);

    // Function to trigger interactions based on scroll position
    let isInFrameworkSection = false;
    let currentFilterIndex = 0;
    let lastFilterChangeTime = 0;
    const FILTER_CHANGE_DELAY = 2000; // 2 seconds between filter changes

    function triggerInteractions() {
        // Get all interactive elements
        const techCards = document.querySelectorAll('.tech-card');
        const roiBars = document.querySelectorAll('.roi-bar');
        const maturityLevels = document.querySelectorAll('.maturity-level');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const impactItems = document.querySelectorAll('.impact-item');

        // Calculate which elements are in view
        const viewportHeight = window.innerHeight;
        const currentScroll = window.scrollY;

        // Trigger tech card expansions
        techCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
                const requirements = card.querySelector('.tech-requirements');
                requirements.style.maxHeight = requirements.scrollHeight + 'px';
                requirements.style.opacity = '1';
            } else {
                const requirements = card.querySelector('.tech-requirements');
                requirements.style.maxHeight = '0';
                requirements.style.opacity = '0';
            }
        });

        // Animate ROI bars
        roiBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
                bar.classList.add('animate');
            }
        });

        // Activate maturity levels
        maturityLevels.forEach((level, index) => {
            const rect = level.getBoundingClientRect();
            if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
                setTimeout(() => {
                    level.classList.add('active');
                }, index * 150);
            }
        });

        // Handle framework comparison section
        const filterSection = document.querySelector('.framework-comparison');
        if (filterSection) {
            const rect = filterSection.getBoundingClientRect();
            const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
            const currentTime = Date.now();

            // Reset and continue scrolling if section is not visible
            if (!isFullyVisible) {
                isInFrameworkSection = false;
                currentFilterIndex = 0;
                return false;
            }

            // If we've shown all filters, continue scrolling
            if (currentFilterIndex >= filterButtons.length) {
                isInFrameworkSection = false;
                return false;
            }

            // Show current filter if we're just starting or it's time to switch
            if (!isInFrameworkSection || (currentTime - lastFilterChangeTime >= FILTER_CHANGE_DELAY)) {
                isInFrameworkSection = true;
                lastFilterChangeTime = currentTime;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                filterButtons[currentFilterIndex].classList.add('active');
                filterButtons[currentFilterIndex].click();
                currentFilterIndex++;
            }

            // Pause while showing filters
            return true;
        }

        // Activate impact items
        impactItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        return false; // Continue scrolling
    }

    function startScroll() {
        if (!isScrolling) {
            isScrolling = true;
            controlBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            // Start with a pause at the top
            setTimeout(() => {
                // Reset position to ensure we start from the very top
                scrollPosition = -50;
                window.scrollTo(0, scrollPosition);
            scrollInterval = setInterval(() => {
                if (scrollPosition < scrollHeight - viewportHeight) {
                    // Check if we should pause for framework section
                    if (triggerInteractions()) {
                        return; // Don't increment scroll position
                    }
                    scrollPosition += 2; // Slower scroll speed
                    window.scrollTo(0, scrollPosition);
                } else {
                    // Clear the interval when reaching bottom
                    clearInterval(scrollInterval);
                    // Pause at the bottom
                    setTimeout(() => {
                        // Reset to top
                        scrollPosition = 0;
                        window.scrollTo(0, 0);
                        // Reset framework section state
                        isInFrameworkSection = false;
                        currentFilterIndex = 0;
                        // Pause at top before restarting
                        setTimeout(() => {
                            startScroll();
                        }, 2500); // Longer initial pause to give time to start recording
                    }, 1500);
                }
            }, 30); // Slower interval for smoother scrolling
            }, 1500);
        }
    }

    function stopScroll() {
        if (isScrolling) {
            isScrolling = false;
            controlBtn.innerHTML = '<i class="fas fa-play"></i> Auto-Scroll';
            clearInterval(scrollInterval);
        }
    }

    controlBtn.addEventListener('click', () => {
        if (isScrolling) {
            stopScroll();
        } else {
            startScroll();
        }
    });

    // Stop scrolling when user manually scrolls
    window.addEventListener('wheel', stopScroll);
    window.addEventListener('touchmove', stopScroll);
}

// Tooltip functionality for AI/ML impacts
function initializeTooltips() {
    const aiImpactElements = document.querySelectorAll('.ai-impact');
    aiImpactElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = event.target.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.display = 'block';
    }
}

function hideTooltip(event) {
    const tooltip = event.target.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}


// AI Impact viewer functionality
function initializeAIImpactViewer() {
    const aiSection = document.querySelector('.ai-ml-section');
    if (aiSection) {
        const impacts = aiSection.querySelectorAll('.impact-item');
        impacts.forEach(impact => {
            impact.addEventListener('click', () => {
                impacts.forEach(i => i.classList.remove('active'));
                impact.classList.add('active');
            });
        });
    }
}

// Cost Analysis Animations
function initializeCostAnalysis() {
    const roiBars = document.querySelectorAll('.roi-bar');
    
    // Animate ROI bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Add animation class after a small delay for each bar
                setTimeout(() => {
                    bar.classList.add('animate');
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.2 }); // Lower threshold for earlier animation trigger

    // Observe each ROI bar with a staggered delay
    roiBars.forEach((bar, index) => {
        setTimeout(() => {
            observer.observe(bar);
        }, index * 100);
    });

    // Add hover effects for cost items
    const costItems = document.querySelectorAll('.cost-item');
    costItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s ease';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
}

// Global Compliance Interactions
function initializeGlobalCompliance() {
    const regionCards = document.querySelectorAll('.region-card');
    const overlapItems = document.querySelectorAll('.overlap-item');

    // Region card hover effects
    regionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

}

// Timeline Animations
function initializeTimeline() {
    const timelinePhases = document.querySelectorAll('.timeline-phase');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelinePhases.forEach(phase => {
        phase.style.opacity = '0';
        phase.style.transform = 'translateY(20px)';
        phase.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(phase);
    });
}

// Emerging Technology Interactions
function initializeEmergingTech() {
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const requirements = card.querySelector('.tech-requirements');
            requirements.style.maxHeight = requirements.scrollHeight + 'px';
            requirements.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            const requirements = card.querySelector('.tech-requirements');
            requirements.style.maxHeight = '0';
            requirements.style.opacity = '0';
        });
    });
}

// Maturity Model Interactions
function initializeMaturityModel() {
    const maturityLevels = document.querySelectorAll('.maturity-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    maturityLevels.forEach(level => observer.observe(level));
}

// Recent updates highlighting
function highlightRecentUpdates() {
    const updates = document.querySelectorAll('.recent-update');
    updates.forEach(update => {
        update.classList.add('highlight');
        setTimeout(() => {
            update.classList.remove('highlight');
        }, 3000);
    });
}

// Compliance checklist generator
function generateChecklist(framework) {
    const checklistItems = {
        CMMC: [
            'Access Control',
            'Asset Management',
            'Audit and Accountability',
            'Configuration Management',
            'Identity and Authentication'
        ],
        NIST: [
            'Identify',
            'Protect',
            'Detect',
            'Respond',
            'Recover'
        ]
    };

    return checklistItems[framework] || [];
}

// AI/ML compliance assessment
function assessAICompliance(framework) {
    const aiRequirements = {
        transparency: ['Model documentation', 'Decision explanation'],
        fairness: ['Bias testing', 'Equal treatment verification'],
        security: ['Data protection', 'Model security'],
        accountability: ['Audit trails', 'Human oversight']
    };

    return aiRequirements;
}
