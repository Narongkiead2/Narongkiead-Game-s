let stripe = Stripe('pk_live_51QLNKeKbsfg3iOwVMCbsgZiXX6MHL1y3gy2kEjPtlTn7qgBqspRAodKLtTUTVfCeMmXllTm8uA4ltcFlVNXqSAWW007i9BHgAc');
let elements;

async function initialize() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // เช็คว่ามีสินค้าในตะกร้าหรือไม่
    if (cart.length === 0) {
      showAlert('ไม่พบสินค้าในตะกร้า', 'warning');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    // เช็คยอดเงินขั้นต่ำ
    if (total < 1) {
      showAlert('ยอดสั่งซื้อต้องมากกว่า 1 บาท', 'warning');
      return;
    }

    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: Math.round(total * 100),
        currency: 'thb'
      }),
    });

    if (!response.ok) {
      throw new Error('การเชื่อมต่อกับเซิร์ฟเวอร์ล้มเหลว');
    }

    const { clientSecret } = await response.json();
    elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    document.querySelector("#payment-form").addEventListener("submit", handleSubmit);
    
    showAlert('พร้อมรับชำระเงินแล้ว', 'success');

  } catch (error) {
    showAlert('เกิดข้อผิดพลาดในการเตรียมระบบชำระเงิน: ' + error.message, 'error');
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    // เช็คว่ามีสินค้าในตะกร้าหรือไม่
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      showAlert('กรุณาเพิ่มสินค้าในตะกร้าก่อนชำระเงิน', 'warning');
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success.html`,
      },
    });

    if (error) {
      // จัดการ error ตามประเภท
      switch (error.type) {
        case 'card_error':
          showAlert('ข้อมูลบัตรไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง', 'error');
          break;
        case 'validation_error':
          showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
          break;
        case 'api_error':
          showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่ภายหลัง', 'error');
          break;
        default:
          showAlert(error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ', 'error');
      }
    }
  } catch (error) {
    showAlert('เกิดข้อผิดพลาดในการชำระเงิน: ' + error.message, 'error');
  }
  
  setLoading(false);
}

function setLoading(isLoading) {
  const button = document.querySelector("#submit");
  const spinner = document.querySelector("#spinner");
  const buttonText = document.querySelector("#button-text");

  if (isLoading) {
    button.disabled = true;
    spinner.classList.remove("hidden");
    buttonText.classList.add("hidden");
  } else {
    button.disabled = false;
    spinner.classList.add("hidden");
    buttonText.classList.remove("hidden");
  }
}


  // เรียกใช้งานเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', initialize);

//-------------------------------------------------------------------
function showAlert(message, type = 'error') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type}`;
    
    alertContainer.innerHTML = `
      <div class="alert-message">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                       type === 'success' ? 'fa-check-circle' : 
                       'fa-exclamation-triangle'}"></i>
        ${message}
      </div>
      <button onclick="this.parentElement.remove()" class="alert-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.querySelector('.payment-section').prepend(alertContainer);
    
    // ลบการแจ้งเตือนอัตโนมัติหลัง 5 วินาที
    setTimeout(() => {
      alertContainer.remove();
    }, 5000);
  }