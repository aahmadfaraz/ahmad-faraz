/*------------------- navigation menu -------------------*/
(() => {
  const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeBtn = navMenu.querySelector(".close-nav-menu");

  hamburgerBtn.addEventListener("click", showNavMenu);
  closeBtn.addEventListener("click", hideNavMenu);

  function showNavMenu() {
    navMenu.classList.add("open");
    bodyScrollingToggle();
  }
  function hideNavMenu() {
    navMenu.classList.remove("open");
    fadeOutEffect();
    bodyScrollingToggle();
  }
  function fadeOutEffect() {
    document.querySelector(".fade-out-effect").classList.add("active");
    setTimeout(() => {
      document.querySelector(".fade-out-effect").classList.remove("active");
    }, 300);
  }

  // attach an event handler to document
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("link-item")) {
      // make sure event.target.hash has a value before overriding default behavior
      if (event.target.hash !== "") {
        // prevent default anchor click behvior
        event.preventDefault();
        const hash = event.target.hash;
        // deactivate existing active 'section'
        document.querySelector(".section.active").classList.add("hide");
        document.querySelector(".section.active").classList.remove("active");
        // activate new 'section'
        document.querySelector(hash).classList.add("active");
        document.querySelector(hash).classList.remove("hide");
        // deactivate existing active navigation menu 'link-item'
        navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
        navMenu.querySelector(".active").classList.remove("active", "inner-shadow");
        // if clicked 'link-item is contained withing the navigation menu'
        if (navMenu.classList.contains("open")) {
          // activate new navigation menu 'link-item'
          event.target.classList.add("active", "inner-shadow");
          event.target.classList.remove("outer-shadow", "hover-in-shadow");
          // hode navigation menu
          hideNavMenu();
        } else {
          let navItems = navMenu.querySelectorAll(".link-item");
          navItems.forEach((item) => {
            if (hash === item.hash) {
              // activate new navigation menu 'link-item'
              event.target.classList.add("active", "inner-shadow");
              event.target.classList.remove("outer-shadow", "hover-in-shadow");
            }
          });
          fadeOutEffect();
        }
        // add hash(#) to url
        window.location.hash = hash;
      }
    }
  });
})();

/*------------------- about section tabs -------------------*/

(() => {
  const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

  tabsContainer.addEventListener("click", (event) => {
    /* if event.target contains tab items class and not contains active class */
    if (event.target.classList.contains("tab-item") && !event.target.classList.contains("active")) {
      const target = event.target.getAttribute("data-target");
      // deactivate existing active 'tab-item'
      tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
      // activate new 'tab item'
      event.target.classList.add("active", "outer-shadow");
      // deactivate existing active 'tab-content'
      aboutSection.querySelector(".tab-content.active").classList.remove("active");
      //  activate new tab-content
      aboutSection.querySelector(target).classList.add("active");
    }
  });
})();

function bodyScrollingToggle() {
  document.body.classList.toggle("stop-scrolling");
}

//! portfolio section start
(() => {
  const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioPopup = document.querySelector(".portfolio-popup"),
    projectDetailsBtn = document.querySelector(".pp-project-details-btn"),
    projectDetailsContainer = document.querySelector(".pp-details"),
    closeBtn = document.querySelector(".pp-close"),
    prevBtn = document.querySelector(".pp-prev"),
    nextBtn = document.querySelector(".pp-next"),
    ppImg = document.querySelector(".pp-img"),
    ppLoader = document.querySelector(".pp-loader"),
    ppCounter = document.querySelector(".pp-counter");

  let slideIndex = 0;
  let screenshoots = [];

  /* Filter portfolio items */
  filterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("filter-item") && !event.target.classList.contains("active")) {
      filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
      event.target.classList.add("active", "outer-shadow");
      const target = event.target.getAttribute("data-target");
      const portfolioItems = document.querySelectorAll(".portfolio-item");
      portfolioItems.forEach((item) => {
        if (target === item.getAttribute("data-category") || target === "all") {
          item.classList.remove("hide");
          item.classList.add("show");
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    }
  });

  /* Handle portfolio item click */
  portfolioItemsContainer.addEventListener("click", (event) => {
    if (event.target.closest(".portfolio-item-inner")) {
      const portfolioItem = event.target.closest(".portfolio-item");
      const itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
      screenshoots = portfolioItem.querySelector(".portfolio-item-img img").getAttribute("data-screenshots").split(",");
      if (screenshoots.length === 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      } else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
      }
      slideIndex = 0;
      popupToggle();
      popupSideshow();
      populateProjectDetails(portfolioItem);
    }
  });

  /* Handle close button click */
  closeBtn.addEventListener("click", () => {
    projectDetailsContainer.classList.remove("active");
    projectDetailsContainer.style.maxHeight = 0;
    popupToggle();
  });

  /* Handle project details button click */
  projectDetailsBtn.addEventListener("click", () => {
    popupDetailsToggle();
  });

  /* Handle previous button click */
  prevBtn.addEventListener("click", () => {
    slideIndex = slideIndex === 0 ? screenshoots.length - 1 : slideIndex - 1;
    popupSideshow();
  });

  /* Handle next button click */
  nextBtn.addEventListener("click", () => {
    slideIndex = slideIndex === screenshoots.length - 1 ? 0 : slideIndex + 1;
    popupSideshow();
  });

  /* Toggle popup visibility */
  function popupToggle() {
    portfolioPopup.classList.toggle("open");
    bodyScrollingToggle();
  }

  /* Toggle project details visibility */
  function popupDetailsToggle() {
    projectDetailsContainer.classList.toggle("active");
    projectDetailsContainer.style.maxHeight = projectDetailsContainer.classList.contains("active") ? projectDetailsContainer.scrollHeight + "px" : 0;
  }

  /* Display slideshow in popup */
  function popupSideshow() {
    const imgSrc = screenshoots[slideIndex];
    ppImg.src = imgSrc;
    ppLoader.classList.add("active");
    ppImg.onload = () => {
      ppLoader.classList.remove("active");
      ppCounter.textContent = `${slideIndex + 1} of ${screenshoots.length}`;
    };
  }

  /* Toggle body scrolling */
  function bodyScrollingToggle() {
    document.body.classList.toggle("stop-scrolling");
  }

  /* Populate project details */
  function populateProjectDetails(portfolioItem) {
    const title = portfolioItem.querySelector(".portfolio-item-title").textContent;
    const brief = portfolioItem.querySelector(".description p").textContent;
    const year = portfolioItem.querySelector(".info ul li:nth-child(1) span").textContent;
    const tools = portfolioItem.querySelector(".info ul li:nth-child(2) span").textContent;

    const titleElement = projectDetailsContainer.querySelector(".pp-title h2");
    const categoryElement = projectDetailsContainer.querySelector(".pp-title .pp-project-category");
    const briefElement = projectDetailsContainer.querySelector(".description p");
    const yearElement = projectDetailsContainer.querySelector(".info ul li:nth-child(1) span");
    const toolsElement = projectDetailsContainer.querySelector(".info ul li:nth-child(2) span");

    titleElement.textContent = title;
    categoryElement.textContent = portfolioItem.getAttribute("data-category");
    briefElement.textContent = brief;
    yearElement.textContent = year;
    toolsElement.textContent = tools;
  }
})();

/* Dynamically generate portfolio items */
document.addEventListener("DOMContentLoaded", () => {
  const portfolioItemsContainer = document.querySelector(".portfolio-items");

  // Sample data for portfolio items (Replace with your actual data)
  const portfolioData = [
    {
      category: "mobile-app",
      title: "Paraiso",
      brief: "Transforming student dining with our click & collect app for savings and culinary discovery",
      year: "2023",
      tools: "flutter, firebase",
      screenshots: ["img/portfolio/large/project-1/1.jpg", "img/portfolio/large/project-1/2.jpg", "img/portfolio/large/project-1/3.jpg"],
    },
    {
      category: "mobile-app",
      title: "Eduverse",
      brief: "Online Education Platform",
      year: "2023",
      tools: "flutter, firebase",
      screenshots: [
        "img/portfolio/large/project-2/1.jpg",
        "img/portfolio/large/project-2/2.jpg",
        "img/portfolio/large/project-2/3.jpg",
        "img/portfolio/large/project-2/4.jpg",
        "img/portfolio/large/project-2/5.jpg",
        "img/portfolio/large/project-2/6.jpg",
        "img/portfolio/large/project-2/7.jpg",
        "img/portfolio/large/project-2/8.jpg",
        "img/portfolio/large/project-2/9.jpg",
        "img/portfolio/large/project-2/10.jpg",
        "img/portfolio/large/project-2/11.jpg",
        "img/portfolio/large/project-2/12.jpg",
      ],
    },
    {
      category: "mobile-app",
      title: "Truedar",
      brief: "Born on the rich Emirati legacy, TrueDar simplifies your property search in UAE's dynamic landscape",
      year: "2024",
      tools: "flutter, firebase, node, express, next js, SERP, stripe etc.",
      screenshots: [
        "img/portfolio/large/project-3/1.jpg",
        "img/portfolio/large/project-3/2.jpg",
        "img/portfolio/large/project-3/3.jpg",
        "img/portfolio/large/project-3/4.jpg",
        "img/portfolio/large/project-3/5.jpg",
        "img/portfolio/large/project-3/6.jpg",
        "img/portfolio/large/project-3/7.jpg",
      ],
    },
  ];

  // Function to create portfolio item HTML
  function createPortfolioItemHTML(item) {
    return `
      <div class="portfolio-item" data-category="${item.category}">
        <div class="portfolio-item-inner outer-shadow">
          <div class="portfolio-item-img">
            <img src="${item.screenshots[0]}" alt="${item.title}" data-screenshots="${item.screenshots.join(",")}">
            <span class="view-project">view project</span>
          </div>
          <p class="portfolio-item-title">${item.title}</p>
          <div class="portfolio-item-details">
            <div class="row">
              <div class="description">
                <h3>project brief:</h3>
                <p>${item.brief}</p>
              </div>
              <div class="info">
                <h3>project info:</h3>
                <ul>
                  <li>Date - <span>${item.year}</span></li>
                  <li>Tools - <span>${item.tools}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Generate HTML for each portfolio item
  portfolioData.forEach((item) => {
    const portfolioItemHTML = createPortfolioItemHTML(item);
    portfolioItemsContainer.insertAdjacentHTML("beforeend", portfolioItemHTML);
  });
});

//! portfolio section end

/*------------------- testimonial slider -------------------*/
(() => {
  const sliderContainer = document.querySelector(".testi-slider-container"),
    slides = sliderContainer.querySelectorAll(".testi-item"),
    slideWidth = sliderContainer.offsetWidth,
    prevBtn = document.querySelector(".testi-slider-nav .prev"),
    nextBtn = document.querySelector(".testi-slider-nav .next"),
    activeSlide = sliderContainer.querySelector(".testi-item.active");
  let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

  // set width of all slides
  slides.forEach((slide) => {
    slide.style.width = slideWidth + "px";
  });
  // set width of slideContainer
  sliderContainer.style.width = slideWidth * slides.length + "px";

  nextBtn.addEventListener("click", () => {
    if (slideIndex === slides.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    slider();
  });

  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = slides.length - 1;
    } else {
      slideIndex--;
    }
    slider();
  });

  function slider() {
    // deactivate existing slider
    sliderContainer.querySelector(".testi-item.active").classList.remove("active");
    // activate new slider
    slides[slideIndex].classList.add("active");
    sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + "px";
  }
  slider();
})();

/*------------------- hide all sections except active -------------------*/
(() => {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (!section.classList.contains("active")) {
      section.classList.add("hide");
    }
  });
})();

window.addEventListener("load", () => {
  // preloader
  document.querySelector(".preloader").classList.add("fade-out");
  setTimeout(() => {
    document.querySelector(".preloader").style.display = "none";
  }, 600);
});
