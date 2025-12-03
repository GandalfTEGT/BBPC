// Warranty page specific functionality
function initializeWarrantyPage() {
    // Initialize table of contents for warranty sections
    initializeTableOfContents();
    
    // Add print functionality for warranty page
    initializePrintFunctionality();
    
    // Enhance contact form interactions
    initializeContactEnhancements();
    
    // Smooth scroll to sections
    initializeWarrantySmoothScroll();
}

// Generate table of contents for warranty sections
function initializeTableOfContents() {
    const policyContainer = document.querySelector('.policy-container');
    if (!policyContainer) return;
    
    const headings = policyContainer.querySelectorAll('h2');
    if (headings.length > 0) {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>Table of Contents</h3><ul></ul>';
        
        headings.forEach((heading, index) => {
            const id = `section-${index + 1}`;
            heading.id = id;
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });
            
            listItem.appendChild(link);
            toc.querySelector('ul').appendChild(listItem);
        });
        
        policyContainer.insertBefore(toc, policyContainer.firstChild);
        
    }
}

// Print functionality for warranty page
function initializePrintFunctionality() {
    const printButton = document.createElement('button');
    printButton.textContent = 'Print Document';
    printButton.className = 'button button-secondary';
    printButton.style.marginBottom = '20px';
    printButton.addEventListener('click', () => {
        window.print();
    });
    
    const policyContainer = document.querySelector('.policy-container');
    if (policyContainer) {
        policyContainer.insertBefore(printButton, policyContainer.firstChild);
    }
    

}

// Enhance contact email interactions
function initializeContactEnhancements() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Track email clicks if needed
            console.log('Email link clicked:', link.href);
        });
    });
}

// Enhanced smooth scrolling for warranty sections
function initializeWarrantySmoothScroll() {
    const links = document.querySelectorAll('a[href^="#section-"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize warranty page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWarrantyPage();
    console.log('BonnieByte PC - Warranty page scripts loaded');
});

// Export for potential use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWarrantyPage,
        initializeTableOfContents,
        initializePrintFunctionality,
        initializeContactEnhancements,
        initializeWarrantySmoothScroll
    };

}



