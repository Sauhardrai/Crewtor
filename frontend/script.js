
window.addEventListener('DOMContentLoaded', function () {
  if (! getItemWithExpiry('crewtorAnnouncement')) {
    Swal.fire({
      title: '🎉 Special Offer!',
      text: 'First 50 students get FREE registration on Crewtor!',
      icon: 'info',
      confirmButtonText: 'Register Now',
      showCloseButton: true,
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      background: '#fefefe',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = './html/signup.html'; // 👈 your link here
      }
      setItemWithExpiry('crewtorAnnouncement', 'shown', 2 * 60 * 60 * 1000);
    });
    localStorage.setItem('crewtorOfferShown', 'true');
  }
});


function setItemWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl, // ttl = time to live in milliseconds
  };
  localStorage.setItem(key, JSON.stringify(item));
}


function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // If expired, remove from storage and return null
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}


window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    navbar.classList.add('border-bottom');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.remove('border-bottom');
  }


});




const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 2,
    }
  }
});

const questions = document.querySelectorAll('.faq-question');

questions.forEach((question) => {
  question.addEventListener('click', () => {
    question.classList.toggle('active');
    const answer = question.nextElementSibling;
    answer.classList.toggle('show');
  });
});










