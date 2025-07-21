document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("popup");
  const popupClose = document.getElementById("popupClose");
  if (popup && popupClose) {
    popup.style.display = "flex";
    popupClose.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const closeMenu = document.getElementById("closeMenu");
  if (menuToggle && navMenu && closeMenu) {
    menuToggle.onclick = () => navMenu.classList.add("active");
    closeMenu.onclick = () => navMenu.classList.remove("active");
  }

  let slideIndex1 = 0;
  const slides1 = document.querySelectorAll(".slider-image");
  const prevBtn1 = document.getElementById("prevSlide");
  const nextBtn1 = document.getElementById("nextSlide");

  function showSlide1(index) {
    slides1.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  if (slides1.length) {
    showSlide1(slideIndex1);
    if (nextBtn1) {
      nextBtn1.addEventListener("click", () => {
        slideIndex1 = (slideIndex1 + 1) % slides1.length;
        showSlide1(slideIndex1);
      });
    }
    if (prevBtn1) {
      prevBtn1.addEventListener("click", () => {
        slideIndex1 = (slideIndex1 - 1 + slides1.length) % slides1.length;
        showSlide1(slideIndex1);
      });
    }
    setInterval(() => {
      slideIndex1 = (slideIndex1 + 1) % slides1.length;
      showSlide1(slideIndex1);
    }, 4000);
  }

  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavClose = document.getElementById("mobileNavClose");
  if (hamburger && mobileNav && mobileNavClose) {
    hamburger.addEventListener("click", () => {
      if(mobileNav.classList.contains("active")){
        mobileNav.classList.remove("active");
      } else {
        mobileNav.classList.add("active");
      }
    });
    mobileNavClose.addEventListener("click", () => {
      mobileNav.classList.remove("active");
    });
  }

  const heroSlides = document.querySelectorAll(".hero-slide");
  const prevBtn2 = document.getElementById("prev");
  const nextBtn2 = document.getElementById("next");
  let slideIndex2 = 0;

  function showSlide2(index) {
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  if (heroSlides.length) {
    showSlide2(slideIndex2);
    if (prevBtn2) {
      prevBtn2.addEventListener("click", () => {
        slideIndex2 = (slideIndex2 - 1 + heroSlides.length) % heroSlides.length;
        showSlide2(slideIndex2);
      });
    }
    if (nextBtn2) {
      nextBtn2.addEventListener("click", () => {
        slideIndex2 = (slideIndex2 + 1) % heroSlides.length;
        showSlide2(slideIndex2);
      });
    }
    setInterval(() => {
      slideIndex2 = (slideIndex2 + 1) % heroSlides.length;
      showSlide2(slideIndex2);
    }, 5000);
  }

  const roomButtons = document.querySelectorAll(".room-buttons button");
  const roomSections = document.querySelectorAll(".room-section");

  function showRoom(roomId, event) {
    roomSections.forEach(section => section.classList.remove("active"));
    roomButtons.forEach(btn => btn.classList.remove("active"));
    const targetSection = document.getElementById(roomId);
    if (targetSection) targetSection.classList.add("active");
    if (event?.currentTarget) event.currentTarget.classList.add("active");
  }

  const roomMapping = {
    "living room": "living",
    "bedroom": "bedroom",
    "dining": "dining",
    "office": "office",
    "outdoor": "outdoor"
  };

  roomButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const btnText = button.textContent.trim().toLowerCase();
      const roomId = roomMapping[btnText];
      if (roomId) showRoom(roomId, e);
    });
  });

  const defaultActiveBtn = document.querySelector(".room-buttons button.active");
  if (defaultActiveBtn) {
    const defaultText = defaultActiveBtn.textContent.trim().toLowerCase();
    const defaultRoomId = roomMapping[defaultText];
    if (defaultRoomId) showRoom(defaultRoomId);
  }

  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});
