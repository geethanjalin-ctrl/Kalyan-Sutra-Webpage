/* ==========================================================================
   Sanskriti Matrimony Blog - Interactive JavaScript Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTheme();
  initTraditionsShowcase();
  initHoroscopeMatcher();
  initSuccessStoriesCarousel();
  initInspirationFilter();
  initLightbox();
  initChecklistTracker();
  initMuhurthamCalendar();
  // initScrollReveal();
});

// Utility: Create and Show Premium Toast Notification
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-message toast-${type}`;
  
  // Icon based on type
  let icon = "✨";
  if (type === "error") icon = "⚠️";
  if (type === "heart") icon = "❤️";

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Remove toast from DOM after animations complete (4.3s total)
  setTimeout(() => {
    toast.remove();
  }, 4300);
}

// 1. Navigation Scrolled State & Search Box Toggle
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const searchToggle = document.getElementById("search-toggle");
  const searchBox = document.getElementById("search-box");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  
  // Scroll Listener for Glassmorphism shrink
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Toggle Search Input
  if (searchToggle && searchBox) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      searchBox.classList.toggle("active");
      if (searchBox.classList.contains("active")) {
        const input = searchBox.querySelector("input");
        if (input) input.focus();
      }
    });

    // Close search box if clicked outside
    document.addEventListener("click", (e) => {
      if (!searchBox.contains(e.target) && e.target !== searchToggle) {
        searchBox.classList.remove("active");
      }
    });
  }

  // Toggle Mobile Menu
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      navbar.classList.toggle("mobile-active");
    });

    // Close menu when clicking nav link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        navbar.classList.remove("mobile-active");
      });
    });
  }

  // Live feed-article filtering via search boxes (desktop, feed inline, and mobile dropdown)
  const searchInput = document.getElementById("nav-search-input");
  const feedSearchInput = document.getElementById("feed-search-input");
  const mobileSearchInput = document.getElementById("mobile-search-input");
  
  const handleSearchInput = (e) => {
    const val = e.target.value;
    const hasFeed = document.querySelectorAll(".feed-item").length > 0;
    
    if (!hasFeed) {
      // If we are on a details page, redirect to journals.html with the search query
      window.location.href = `journals.html?search=${encodeURIComponent(val)}`;
    } else {
      filterArticlesByKeyword(val);
      // Synchronize all search inputs on the page
      if (searchInput && searchInput !== e.target) searchInput.value = val;
      if (feedSearchInput && feedSearchInput !== e.target) feedSearchInput.value = val;
      if (mobileSearchInput && mobileSearchInput !== e.target) mobileSearchInput.value = val;
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }

  if (feedSearchInput) {
    feedSearchInput.addEventListener("input", handleSearchInput);
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", handleSearchInput);
  }

  // Handle incoming search query parameter on page load
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    const activeSearch = searchQuery.trim();
    if (searchInput) searchInput.value = activeSearch;
    if (feedSearchInput) feedSearchInput.value = activeSearch;
    if (mobileSearchInput) mobileSearchInput.value = activeSearch;
    
    setTimeout(() => {
      filterArticlesByKeyword(activeSearch);
      const feedSection = document.getElementById("latest-articles") || document.getElementById("articles-feed");
      if (feedSection) {
        feedSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  }
}

// 2. Light / Dark Mode Override - Kalyan Matrimony Light UI theme lock
function initTheme() {
  document.body.classList.remove("dark");
  localStorage.setItem("theme", "light");
}

// 3. South Indian Wedding Traditions Tab System
function initTraditionsShowcase() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Deactivate all tabs and panels
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach(p => p.classList.remove("active"));

      // Activate clicked tab
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Activate corresponding panel
      const targetPanelId = tab.getAttribute("aria-controls");
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

// 4. Interactive Horoscope Compatibility Calculator
function initHoroscopeMatcher() {
  const form = document.getElementById("horoscope-form");
  const resultContainer = document.getElementById("matching-result");
  const loadingOverlay = document.getElementById("matching-loading");
  const resultDetails = document.getElementById("result-details-content");

  if (!form || !resultContainer) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const groom = document.getElementById("groom-name").value.trim();
    const bride = document.getElementById("bride-name").value.trim();
    const groomRashi = document.getElementById("groom-rashi").options[document.getElementById("groom-rashi").selectedIndex].text;
    const brideRashi = document.getElementById("bride-rashi").options[document.getElementById("bride-rashi").selectedIndex].text;
    const groomStar = document.getElementById("groom-nakshatra").options[document.getElementById("groom-nakshatra").selectedIndex].text;
    const brideStar = document.getElementById("bride-nakshatra").options[document.getElementById("bride-nakshatra").selectedIndex].text;

    // Show result container, and trigger loading spinner
    resultContainer.classList.remove("hidden");
    loadingOverlay.style.display = "flex";
    resultDetails.innerHTML = ""; // Clear previous results

    // Scroll result container into view
    resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Simulate astronomical chart calculations (1.8 seconds)
    setTimeout(() => {
      loadingOverlay.style.display = "none";

      // Calculate a deterministic compatibility score based on names character codes
      const combineNames = (groom + bride).toLowerCase().replace(/\s+/g, "");
      let scoreSeed = 0;
      for (let i = 0; i < combineNames.length; i++) {
        scoreSeed += combineNames.charCodeAt(i);
      }
      
      // Standardize match percentage between 68% and 96%
      const matchScore = 68 + (scoreSeed % 29); 
      const gunasMatched = Math.round((matchScore / 100) * 36);

      // Determine matching status description
      let status = "Excellent Match (Uttama Porutham)";
      let verdictColor = "var(--muted-green)";
      let advice = `${groom} and ${bride} demonstrate exceptional alignment in their planetary houses. The Moon signs (${groomRashi} & ${brideRashi}) share a friendly relationship. Vedic texts indicate strong mental compatibility, matching priorities, and robust health parameters. A long and happy life together is predicted.`;
      
      if (matchScore < 76) {
        status = "Good Match (Madhyama Porutham)";
        verdictColor = "var(--gold-main)";
        advice = `The horoscope compatibility between ${groom} and ${bride} shows balanced indicators. While Rasi Lord compatibility matches well, there are slight transit variations. Mental values align, though communication will require conscious cultivation. Astrologers recommend donating food on Tuesdays to strengthen compatibility.`;
      } else if (matchScore > 88) {
        status = "Outstanding Divine Match (Maha Porutham)";
        verdictColor = "var(--peacock-blue)";
        advice = `A heavenly alignment! The birth stars (${groomStar} and ${brideStar}) possess a rare harmonious configuration (Mahendra and Yoni Porutham are highly compatible). Family ties will be exceptionally strong, and the couple will bring immense material and spiritual prosperity to their lineage.`;
      }

      // Generate HTML report dynamically
      resultDetails.innerHTML = `
        <div class="result-header">
          <div>
            <h3 class="result-couple-names">${groom} & ${bride}</h3>
            <span style="color: ${verdictColor}; font-weight: 700; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">${status}</span>
          </div>
          <div class="result-score-badge">${matchScore}% Match</div>
        </div>
        <div class="result-body">
          <h5>Compatibility Insights</h5>
          <p>${advice}</p>
          
          <div class="result-stats-grid">
            <div class="stat-item-row">
              <span class="label">Matched Gunas</span>
              <span class="value">${gunasMatched} of 36 Gunas</span>
            </div>
            <div class="stat-item-row">
              <span class="label">Rashi Lord Match</span>
              <span class="value">${matchScore > 75 ? "Friendly" : "Neutral"}</span>
            </div>
            <div class="stat-item-row">
              <span class="label">Vasya (Attraction)</span>
              <span class="value">Highly Compatible</span>
            </div>
            <div class="stat-item-row">
              <span class="label">Chevvai (Mars) Dosh</span>
              <span class="value">Aligned & Safe</span>
            </div>
          </div>

          <button class="btn-reset-calculator" id="btn-recalculate">Calculate Another Match</button>
        </div>
      `;

      // Set up click listener for recalculating
      document.getElementById("btn-recalculate").addEventListener("click", () => {
        resultContainer.classList.add("hidden");
        form.reset();
      });

      showToast("Horoscope compatibility analysis completed successfully!");
    }, 1800);
  });
}

// 5. Success Stories Testimonial Carousel
function initSuccessStoriesCarousel() {
  const track = document.getElementById("carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const indicatorsContainer = document.getElementById("carousel-indicators");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoAdvanceTimer;

  // Set up Slide Navigation
  const moveToSlide = (index) => {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    
    currentIndex = index;

    // Apply translation transition
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Toggle active classes on slides
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    // Toggle active dots
    if (indicatorsContainer) {
      const dots = Array.from(indicatorsContainer.querySelectorAll(".indicator-dot"));
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    resetAutoAdvance();
  };

  // Next/Prev Buttons event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));
  }

  // Set up Indicator Dot clicks
  if (indicatorsContainer) {
    // Generate dots dynamically if they aren't fully configured
    const dots = Array.from(indicatorsContainer.querySelectorAll(".indicator-dot"));
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => moveToSlide(index));
    });
  }

  // Auto-advance loop setup
  const startAutoAdvance = () => {
    autoAdvanceTimer = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 8000); // Shift slides every 8 seconds
  };

  const resetAutoAdvance = () => {
    clearInterval(autoAdvanceTimer);
    startAutoAdvance();
  };

  // Start loop initially
  startAutoAdvance();
}

// 6. Pinterest Style Inspiration Category Filters
function initInspirationFilter() {
  const filters = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".masonry-item");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      // Toggle active filter state
      filters.forEach(f => f.classList.remove("active"));
      filter.classList.add("active");

      const category = filter.getAttribute("data-filter");

      items.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        
        if (category === "all" || itemCategory === category) {
          // Display matching items with smooth transition
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);
        } else {
          // Hide non-matching items
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// 7. Lightbox Modal popup for gallery zooms
let openLightbox; // Expose globally to bind in inline HTML onclick
function initLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const closeBtn = document.getElementById("lightbox-close");
  const modalImg = document.getElementById("lightbox-img");
  const modalTitle = document.getElementById("lightbox-title");
  const modalDesc = document.getElementById("lightbox-desc");

  if (!modal) return;

  // Bind the globally exposed open function
  openLightbox = function(imageSrc, title, description) {
    modalImg.src = imageSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable scroll
  };

  // Close actions
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Enable scroll
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Esc key closure
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

// Global Save action on grid items
window.saveInspirationItem = function(event, itemName) {
  event.stopPropagation(); // Avoid triggering lightbox view click
  const button = event.currentTarget;
  button.classList.toggle("saved");

  if (button.classList.contains("saved")) {
    button.style.backgroundColor = "var(--kumkum-red)";
    button.style.borderColor = "var(--kumkum-red)";
    button.querySelector("span").textContent = "Saved";
    showToast(`Saved '${itemName}' to your wedding scrapbook!`, "heart");
  } else {
    button.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    button.style.borderColor = "rgba(255, 255, 255, 0.3)";
    button.querySelector("span").textContent = "Save";
    showToast(`Removed '${itemName}' from your wedding scrapbook.`, "error");
  }
};

// 8. Live Interactive Wedding Planning Checklist Tracker
let checklistState = {
  marriage: [
    { text: "Register and secure wedding venue (Mandapam)", checked: true },
    { text: "Complete Nakshatra/Rashi horoscope checks", checked: true },
    { text: "Design and print traditional invitations (Patrika)", checked: false },
    { text: "Send digital invites & manage guest RSVPs", checked: false },
    { text: "Finalize catering menu (Sadhya courses)", checked: false },
    { text: "Hire wedding photographer & videographer teams", checked: false },
    { text: "Book stage decorators, florists, & musicians", checked: false },
    { text: "Purchase sacred puja items (Thali, coconuts)", checked: false },
    { text: "Arrange accommodation for out-of-town guests", checked: false },
    { text: "Prepare marriage registration documents", checked: false }
  ],
  bride: [
    { text: "Select & order bridal Kanjeevaram sarees", checked: false },
    { text: "Finalize temple jewelry sets & Oddiyanam belt", checked: false },
    { text: "Book professional makeup artist & hairstylist", checked: false },
    { text: "Schedule saree draping & blouse fittings", checked: false },
    { text: "Select fresh flower garlands & jasmine hair decor", checked: false },
    { text: "Schedule mehendi/henna session (1 day before)", checked: false },
    { text: "Arrange bridal skincare & wellness sessions", checked: false },
    { text: "Purchase bridal shoes & accessories", checked: false },
    { text: "Coordinate matching outfits for bridesmaids", checked: false },
    { text: "Pack bridal emergency touch-up kit", checked: false }
  ],
  groom: [
    { text: "Select Silk Dhoti & Angavastram for Muhurtham", checked: false },
    { text: "Choose and fit Reception suit or Sherwani", checked: false },
    { text: "Purchase traditional sandals & formal shoes", checked: false },
    { text: "Schedule haircut & styling sessions", checked: false },
    { text: "Coordinate Groomsmen outfits & accessories", checked: false },
    { text: "Finalize wedding rings and secure safely", checked: false },
    { text: "Arrange guest transport to the venue", checked: false },
    { text: "Prepare wedding speech or traditional vows", checked: false },
    { text: "Pack overnight stay suitcase for groom", checked: false },
    { text: "Assign best man for day-of coordination", checked: false }
  ]
};

let currentChecklistCategory = 'marriage';

function initChecklistTracker() {
  renderChecklist();
}

window.switchChecklistCategory = function(category) {
  currentChecklistCategory = category;
  renderChecklist();
  showToast(`Switched to ${category === 'marriage' ? 'General Marriage' : category === 'bride' ? "Bride's" : "Groom's"} Checklist`);
};

function renderChecklist() {
  const container = document.getElementById("checklist-items-list");
  const progressBar = document.getElementById("checklist-progress");
  const progressText = document.getElementById("checklist-progress-text");
  
  if (!container || !progressBar || !progressText) return;
  
  // Update category representation image dynamically
  const checklistImages = {
    marriage: 'inspiration_decor.png',
    bride: 'inspiration_saree.png',
    groom: 'couple2.png'
  };
  const categoryImage = document.getElementById("checklist-category-image");
  if (categoryImage) {
    categoryImage.src = checklistImages[currentChecklistCategory];
    categoryImage.alt = `${currentChecklistCategory === 'marriage' ? 'General Marriage' : currentChecklistCategory === 'bride' ? "Bride's" : "Groom's"} Checklist Representation`;
  }
  
  const items = checklistState[currentChecklistCategory];
  
  // Render HTML list items
  container.innerHTML = items.map((item, index) => `
    <li>
      <label>
        <input type="checkbox" class="checklist-item-check" data-index="${index}" ${item.checked ? 'checked' : ''} onchange="toggleChecklistItem(${index}, this.checked)">
        <span>${item.text}</span>
      </label>
    </li>
  `).join("");
  
  // Calculate and update progress
  const total = items.length;
  const checked = items.filter(item => item.checked).length;
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
  
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${checked} of ${total} tasks completed`;
}

window.toggleChecklistItem = function(index, checked) {
  checklistState[currentChecklistCategory][index].checked = checked;
  
  // Re-calculate progress
  const items = checklistState[currentChecklistCategory];
  const progressBar = document.getElementById("checklist-progress");
  const progressText = document.getElementById("checklist-progress-text");
  
  if (progressBar && progressText) {
    const total = items.length;
    const checkedCount = items.filter(item => item.checked).length;
    const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${checkedCount} of ${total} tasks completed`;
  }
  
  if (checked) {
    showToast("Task completed! Keep it up.", "success");
  }
};

// Download checklist as a PDF file dynamically
window.downloadChecklist = function() {
  showToast("Compiling Kalyan Sutra Wedding Checklist PDF...", "success");
  
  // Wait brief moment for toast to display
  setTimeout(() => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Document styling
      doc.setFillColor(58, 8, 14); // Maroon background header
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(212, 175, 55); // Gold Title Text
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.text("KALYAN SUTRA", 105, 18, { align: "center" });
      
      doc.setTextColor(255, 248, 240); // White Subtitle Text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Your Complete Wedding Planning Checklist & Guide", 105, 28, { align: "center" });
      
      let y = 50;
      
      // Loop through categories
      const categories = [
        { key: 'marriage', title: 'I. GENERAL MARRIAGE CHECKLIST' },
        { key: 'bride', title: "II. BRIDE'S WEDDING CHECKLIST" },
        { key: 'groom', title: "III. GROOM'S WEDDING CHECKLIST" }
      ];
      
      categories.forEach(cat => {
        // Section Header
        doc.setTextColor(58, 8, 14); // Maroon
        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.text(cat.title, 15, y);
        
        // Draw a thin gold separator line below section title
        doc.setDrawColor(212, 175, 55); // Gold
        doc.setLineWidth(0.5);
        doc.line(15, y + 2, 195, y + 2);
        
        y += 10;
        
        // Checklist items
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60); // Dark Gray text
        
        checklistState[cat.key].forEach((item) => {
          // Checkbox outline box
          doc.setDrawColor(100, 100, 100);
          doc.rect(15, y - 3.5, 4, 4);
          
          if (item.checked) {
            // Draw checkmark
            doc.setDrawColor(58, 8, 14);
            doc.setLineWidth(0.8);
            doc.line(15.5, y - 2, 16.5, y - 1);
            doc.line(16.5, y - 1, 18.5, y - 3);
            
            // Strike-through or text modification if checked
            doc.setTextColor(120, 120, 120);
          } else {
            doc.setTextColor(60, 60, 60);
          }
          
          // Draw text
          doc.text(item.text, 22, y);
          y += 7.5;
        });
        
        y += 6; // Gap between sections
      });
      
      // Footer
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("Designed with love and cultural heritage by Kalyan Matrimony Platform. © 2026", 105, 285, { align: "center" });
      
      // Save PDF - will trigger native browser download
      doc.save('Kalyan_Sutra_Wedding_Checklist.pdf');
      
      showToast("Download started! Check your downloads folder.", "success");
    } catch (error) {
      console.error("PDF download failed:", error);
      showToast("Download failed, downloading checklist as Text File instead...", "error");
      
      // Fallback: Text file download
      downloadChecklistAsText();
    }
  }, 1000);
};

// Fallback plain text downloader if jsPDF fails
function downloadChecklistAsText() {
  let content = "KALYAN SUTRA - YOUR COMPLETE WEDDING PLANNING CHECKLIST\n";
  content += "========================================================\n\n";
  
  const categories = [
    { key: 'marriage', title: 'I. GENERAL MARRIAGE CHECKLIST' },
    { key: 'bride', title: "II. BRIDE'S WEDDING CHECKLIST" },
    { key: 'groom', title: "III. GROOM'S WEDDING CHECKLIST" }
  ];
  
  categories.forEach(cat => {
    content += `${cat.title}\n`;
    content += "--------------------------------------------------------\n";
    checklistState[cat.key].forEach(item => {
      content += `[${item.checked ? 'X' : ' '}] ${item.text}\n`;
    });
    content += "\n";
  });
  
  content += "========================================================\n";
  content += "Designed with love by Kalyan Matrimony Platform. © 2026\n";
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "Kalyan_Sutra_Wedding_Checklist.txt");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 9. Kalyan Matrimony quick registration logic
window.handleKalyanRegister = function(event) {
  event.preventDefault();
  const profileFor = document.getElementById("cta-profile-for").value;
  const gender = document.getElementById("cta-gender").value;
  const tongue = document.getElementById("cta-mother-tongue").value;
  const phone = document.getElementById("cta-phone").value.trim();

  showToast("Connecting to Kalyan Matrimony secure servers...", "success");

  setTimeout(() => {
    showToast(`Registration Complete! Searching for verified ${tongue} ${gender} matches...`, "success");
    document.getElementById("cta-phone").value = ""; // Reset
  }, 1500);
};

// 10. Live Article Search / Filter inside articles feed
function filterArticlesByKeyword(keyword) {
  const items = document.querySelectorAll(".feed-item");
  const cleanKeyword = keyword.toLowerCase().trim();

  items.forEach(item => {
    const title = item.querySelector(".feed-title").textContent.toLowerCase();
    const excerpt = item.querySelector(".feed-excerpt").textContent.toLowerCase();
    const category = item.querySelector(".feed-cat").textContent.toLowerCase();
    const keywords = item.getAttribute("data-keywords") || "";

    if (
      title.includes(cleanKeyword) ||
      excerpt.includes(cleanKeyword) ||
      category.includes(cleanKeyword) ||
      keywords.toLowerCase().includes(cleanKeyword)
    ) {
      item.style.display = "grid";
    } else {
      item.style.display = "none";
    }
  });
}

// 11. Category filter buttons in sidebar
window.filterFeedByCategory = function(category, buttonElement) {
  // Toggle active styling on tag buttons
  const buttons = document.querySelectorAll(".tag-link");
  buttons.forEach(btn => btn.classList.remove("active"));
  buttonElement.classList.add("active");

  const items = document.querySelectorAll(".feed-item");

  items.forEach(item => {
    const itemCat = item.getAttribute("data-category");
    if (category === "all" || itemCat === category) {
      item.style.display = "grid";
    } else {
      item.style.display = "none";
    }
  });

  showToast(`Filtered feed by ${buttonElement.textContent}`);
};

// 12. Scroll Reveal Intersection Observer
function initScrollReveal() {
  const sections = document.querySelectorAll(".reveal-section");
  
  const options = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
}

// 13. Auspicious Muhurtham Dates Finder Calendar logic
function initMuhurthamCalendar() {
  const select = document.getElementById("muhurtham-religion-select");
  if (!select) return;
  // Initialize with Tamil dates
  updateMuhurthamDates(select.value);
}

window.updateMuhurthamDates = function(religion) {
  const container = document.getElementById("muhurtham-dates-container");
  if (!container) return;
  
  const data = {
    "hindu-tamil": [
      { month: "Jul", day: "15", desc: "Aani 31 (Auspicious Muhurtham)", good: "09:15 AM - 10:15 AM", rahu: "12:00 PM - 01:30 PM", yama: "07:30 AM - 09:00 AM" },
      { month: "Aug", day: "24", desc: "Avani 08 (Shubha Muhurtham)", good: "09:15 AM - 10:15 AM", rahu: "07:30 AM - 09:00 AM", yama: "10:30 AM - 12:00 PM" },
      { month: "Sep", day: "07", desc: "Avani 22 (Auspicious Muhurtham)", good: "10:45 AM - 11:45 AM", rahu: "07:30 AM - 09:00 AM", yama: "10:30 AM - 12:00 PM" }
    ],
    "hindu-kerala": [
      { month: "Aug", day: "26", desc: "Chingam 10 (Auspicious Muhurtham)", good: "09:30 AM - 10:30 AM", rahu: "12:00 PM - 01:30 PM", yama: "07:30 AM - 09:00 AM" },
      { month: "Sep", day: "10", desc: "Chingam 25 (Shubha Muhurtham)", good: "11:00 AM - 12:00 PM", rahu: "01:30 PM - 03:00 PM", yama: "06:00 AM - 07:30 AM" }
    ],
    "hindu-kannada-telugu": [
      { month: "Jul", day: "19", desc: "Ashadha Suddha Panchami", good: "08:30 AM - 09:30 AM", rahu: "04:30 PM - 06:00 PM", yama: "12:00 PM - 01:30 PM" },
      { month: "Aug", day: "16", desc: "Sravana Suddha Tritiya", good: "09:15 AM - 10:45 AM", rahu: "04:30 PM - 06:00 PM", yama: "12:00 PM - 01:30 PM" }
    ],
    "christian": [
      { month: "Sep", day: "12", desc: "Autumn Wedding Season (Sat)", good: "10:00 AM - 12:30 PM", rahu: "09:00 AM - 10:30 AM", yama: "01:30 PM - 03:00 PM" },
      { month: "Oct", day: "24", desc: "Autumn Wedding Season (Sat)", good: "09:30 AM - 12:00 PM", rahu: "09:00 AM - 10:30 AM", yama: "01:30 PM - 03:00 PM" }
    ],
    "muslim": [
      { month: "Sep", day: "18", desc: "Shawwal Auspicious Nikah (Fri)", good: "08:30 AM - 10:30 AM", rahu: "10:30 AM - 12:00 PM", yama: "03:00 PM - 04:30 PM" },
      { month: "Oct", day: "16", desc: "Rabi' al-awwal Nikah (Fri)", good: "09:00 AM - 11:00 AM", rahu: "10:30 AM - 12:00 PM", yama: "03:00 PM - 04:30 PM" }
    ]
  };

  const selectedDates = data[religion] || [];
  
  if (selectedDates.length === 0) {
    container.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 20px;">No dates available.</p>`;
    return;
  }

  container.innerHTML = selectedDates.map(item => `
    <div class="muhurtham-date-card animate-fade-in" style="animation-duration: 0.4s;">
      <div class="muhurtham-badge">
        <span class="m-month">${item.month}</span>
        <span class="m-day">${item.day}</span>
      </div>
      <div class="muhurtham-details">
        <h5>${item.desc}</h5>
        <div class="muhurtham-time-row">
          <div class="muhurtham-time-item">
            <span>☀️ Good Time:</span>
            <strong>${item.good}</strong>
          </div>
          <div class="muhurtham-time-item avoid">
            <span>🚫 Rahu:</span>
            <strong>${item.rahu}</strong>
          </div>
          <div class="muhurtham-time-item avoid">
            <span>🚫 Yamagandam:</span>
            <strong>${item.yama}</strong>
          </div>
        </div>
      </div>
    </div>
  `).join("");
};
