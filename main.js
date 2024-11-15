let currentSlide = 0;
const slides = document.querySelectorAll('.slider-images img');
const totalSlides = slides.length;
let cartItems = [];
let cart = [];

function goToSlide(slideIndex) {
  if (slideIndex < 0) {
    currentSlide = totalSlides - 1;
  } else if (slideIndex >= totalSlides) {
    currentSlide = 0;
  } else {
    currentSlide = slideIndex;
  }
  document.querySelector('.slider-images').style.transform = `translateX(-${currentSlide * 100}vw)`;
}

setInterval(() => {
  goToSlide(currentSlide + 1);
}, 3000);

function updateCartDisplay() {
  const cartItemsList = document.getElementById('cart-items');
  const cartCount = document.querySelector('.cart-count');
  
  cartItemsList.innerHTML = '';
  let totalPrice = 0;
  
  cartItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('cart-item');
    
    listItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <span class="cart-item-name">${item.name}</span>
      <div class="cart-item-controls">
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <span class="quantity">${item.quantity}</span>
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button onclick="removeItem(${item.id})">Remove</button>
      </div>
    `;
    
    cartItemsList.appendChild(listItem);
    totalPrice += item.price * item.quantity;
  });

  document.getElementById('total-price').innerText = totalPrice.toFixed(2);
  cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);

  const checkoutButton = document.querySelector('.checkout-button');
  if (checkoutButton) {
    checkoutButton.onclick = goToCheckout;
  }
}

function toggleCart() {
  const cart = document.getElementById('cart');
  cart.style.display = cart.style.display === 'none' || cart.style.display === '' ? 'block' : 'none';
}

function increaseQuantity(id) {
  const item = cartItems.find(item => item.id === id);
  if (item) {
    item.quantity++;
    updateCartDisplay();
  }
}

function decreaseQuantity(id) {
  const item = cartItems.find(item => item.id === id);
  if (item && item.quantity > 1) {
    item.quantity--;
    updateCartDisplay();
  }
}

function removeItem(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  
  if (cartItems.length === 0) {
    const cart = document.getElementById('cart');
    document.getElementById('total-price').innerText = '0.00';
    document.querySelector('.cart-count').textContent = '0';
    cart.style.display = 'none';
    
    document.getElementById('cart-items').innerHTML = '';
  } else {
    updateCartDisplay();
  }
}

function addToCart(product) {
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      ...product,
      quantity: 1
    });
  }
  
  updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.getElementById('total-price');
    
    cartItems.innerHTML = '';
    
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        const quantity = item.quantity || 1;
        count += quantity;
        total += item.price * quantity;
        
        const itemElement = document.createElement('li');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, ${quantity - 1})">-</button>
                <span class="quantity">${quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    cartCount.textContent = count;
    totalPrice.textContent = total.toFixed(2);

    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.onclick = goToCheckout;
    }
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

/*__________________________________________________________________________________________*/
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.game-cards');
  const cards = document.querySelectorAll('.game-card');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  
  // สร้างอาร์เรย์ของการ์ดและสุ่มลำดับ
  let gameCards = Array.from(cards);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // สร้างการ์ดชุดแรกแบบสุ่ม
  function createInitialCards() {
    slider.innerHTML = ''; // ล้างการ์ดเดิม
    const shuffledInitial = shuffleArray([...gameCards]);
    shuffledInitial.forEach(card => {
      slider.appendChild(card.cloneNode(true));
    });
    // Clone อีก 2 ชุดต่อท้าย
    for (let i = 0; i < 2; i++) {
      shuffleArray([...gameCards]).forEach(card => {
        slider.appendChild(card.cloneNode(true));
      });
    }
  }
  
  createInitialCards();
  
  let currentPosition = 0;
  const cardWidth = 295;
  const totalCards = gameCards.length;
  let isAnimating = false;
  
  function updateSlider() {
    slider.style.transform = `translateX(${currentPosition}px)`;
  }
  
  function resetPosition() {
    if (currentPosition <= -(totalCards * 2 * cardWidth)) {
      // สร้างการ์ดชุดใหม่แบบสุ่มต่อท้าย
      shuffleArray([...gameCards]).forEach(card => {
        slider.appendChild(card.cloneNode(true));
      });
      // ลบการ์ดชุดแรกที่เลื่อนพ้นไปแล้ว
      for (let i = 0; i < totalCards; i++) {
        slider.removeChild(slider.firstChild);
      }
      currentPosition += totalCards * cardWidth;
      slider.style.transition = 'none';
      updateSlider();
      slider.offsetHeight;
      slider.style.transition = 'transform 0.5s ease';
    }
  }
  
  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentPosition -= cardWidth;
    slider.style.transition = 'transform 0.5s ease';
    updateSlider();
    setTimeout(() => {
      resetPosition();
      isAnimating = false;
    }, 500);
  }
  
  function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentPosition += cardWidth;
    slider.style.transition = 'transform 0.5s ease';
    updateSlider();
    setTimeout(() => {
      if (currentPosition > -cardWidth) {
        // สร้างการ์ดชุดใหม่แบบสุ่มไว้ข้างหน้า
        const tempFragment = document.createDocumentFragment();
        shuffleArray([...gameCards]).forEach(card => {
          tempFragment.appendChild(card.cloneNode(true));
        });
        slider.prepend(tempFragment);
        currentPosition -= totalCards * cardWidth;
        slider.style.transition = 'none';
        updateSlider();
        slider.offsetHeight;
        slider.style.transition = 'transform 0.5s ease';
      }
      isAnimating = false;
    }, 500);
  }
  
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  slider.addEventListener('transitionend', () => {
    isAnimating = false;
  });
});

function goToCheckout() {
  window.location.href = 'checkout.html';
}