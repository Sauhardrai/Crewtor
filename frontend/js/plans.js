const offerPopup = document.getElementById('offer-popup');
const popupCard = document.getElementById('popup-card');
const token = localStorage.getItem('token')
const plans = {
        starter: {
            title: "🔸 Starter Plan",
            basePrice: 599,
            threeMonth: 1599,
            sixMonth: 2499
        },
        achiever: {
            title: "🔷 Achiever Plan",
            basePrice: 999,  // approx monthly
            threeMonth: 2699,
            sixMonth: 4999
        },
        elite: {
            title: "🔴 Elite Plan",
            basePrice: 1299,
            threeMonth: 3499,
            sixMonth: 6599
        }
    };

function openOfferPopup(plan) {
    window.planName = plan;
    
    if(!token){
    Swal.fire({
            icon: 'error',
            title: 'Please Login to Proceed',
        })
        
}else{
    window.decode = jwt_decode(token);
    

    const p = plans[plan];
    document.getElementById("offer-title").textContent = p.title + " – Offers";
    document.getElementById("base-price").textContent = `Base Price: ₹${p.basePrice} / month`;

    document.getElementById("price-3").textContent = `₹${p.threeMonth} total for 3 months`;
    document.getElementById("price-6").textContent = `₹${p.sixMonth} total for 6 months`;

    document.getElementById("save-3").textContent = `You save ₹${(p.basePrice * 3) - p.threeMonth}`;
    document.getElementById("save-6").textContent = `You save ₹${(p.basePrice * 6) - p.sixMonth}`;

    // Show popup
    offerPopup.classList.remove("hidden");
    setTimeout(() => {
        popupCard.classList.remove("scale-95", "opacity-0");
        popupCard.classList.add("scale-100", "opacity-100");
    }, 10);
}}

function closeOfferPopup() {
    popupCard.classList.remove("scale-100", "opacity-100");
    popupCard.classList.add("scale-95", "opacity-0");
    setTimeout(() => offerPopup.classList.add("hidden"), 300);
}

async function openRazorpay(du){
  const plan = plans[planName]
  const duration = {'1m': 'basePrice' , '3m':'threeMonth','6m':'sixMonth'}
  const amount = plan[duration[du]]
  const receipt = "rcpt_" + new Date().getTime();
  
  const res = await fetch("https://crewtor-backend.onrender.com/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, receipt , userId:decode.id, plan:plan.title.slice(3), duration:duration[du] })
  });

  const data = await res.json();
  const options = {
    key: "rzp_test_XfGQVjtquaS8Kj", // public key
    amount: data.amount,
    currency: data.currency,
    name: "Crewtor",
    description: `Payment for ${plan.title.slice(3)}`,
    order_id: data.orderId,
    handler: async function (response) {
      const verify = await fetch("https://crewtor-backend.onrender.com/api/payment/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature
        })
      });

      const result = await verify.json();
      if (result.status === "success") {
        Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
        })
        window.location.href= 'crewdash.html'
      } else {
        Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
        })
      }
    },
    prefill: {
      email: decode.email,
    },
    method: {
    netbanking: false,
    card: true,
    upi: true,
    wallet: true,
    emi: false,
    paylater: false
    },
    upi: {
    flow: "intent"  // 🔥 This triggers auto open in UPI apps like GPay
    },
    theme: {
      color: "#0f172a"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}










