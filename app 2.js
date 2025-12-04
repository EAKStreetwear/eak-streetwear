// Client-side product + cart with WhatsApp + Email checkout (no payment gateway required)
// Edit phone/email below
const WHATSAPP_NUMBER = "905XXXXXXXXX"; // put your number in international format (90...)
const EMAIL = "hello@eakstreetwear.com";

const products = [
  { id: 1, title: "Signature Dril Jacket", price: 750, img: "images/product1.jpg", desc: "Premium heavy dril, tailored fit."},
  { id: 2, title: "EAK Logo Tee", price: 250, img: "images/product2.jpg", desc: "Organic cotton, minimalist logo."},
  { id: 3, title: "Limited Sweat", price: 650, img: "images/product3.jpg", desc: "Brushed interior, dropped shoulder."},
];

const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutWhats = document.getElementById('checkoutWhats');
const checkoutEmail = document.getElementById('checkoutEmail');
const waLinkEl = document.getElementById('waLink');

let cart = [];

// render products
function renderProducts(){
  productsEl.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="price">${p.price.toFixed(2)} ₺</div>
      <button class="add" data-id="${p.id}">Add to cart</button>
    </div>
  `).join('');
  document.querySelectorAll('.add').forEach(b => b.addEventListener('click', e => {
    const id = +e.currentTarget.dataset.id;
    addToCart(id);
  }));
}

// add to cart
function addToCart(id){
  const p = products.find(x => x.id === id);
  const exists = cart.find(i => i.id === id);
  if(exists) exists.qty++;
  else cart.push({ ...p, qty:1 });
  updateCartUI();
}

// update cart UI
function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i) => s + i.qty, 0);
  cartItemsEl.innerHTML = cart.length ? cart.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.title}">
      <div style="flex:1">
        <div style="font-weight:600">${i.title}</div>
        <div style="color:var(--muted);font-size:13px">${i.qty} x ${i.price.toFixed(2)} ₺</div>
      </div>
      <div style="text-align:right">
        <button class="qty" data-id="${i.id}" data-op="-" style="margin-right:8px">−</button>
        <button class="qty" data-id="${i.id}" data-op="+" >+</button>
      </div>
    </div>
  `).join('') : '<p style="color:var(--muted)">Sepetin boş</p>';

  // attach qty listeners
  document.querySelectorAll('.qty').forEach(b => {
    b.addEventListener('click', e => {
      const id = +e.currentTarget.dataset.id;
      const op = e.currentTarget.dataset.op;
      const item = cart.find(x => x.id === id);
      if(!item) return;
      if(op === '-') item.qty = item.qty - 1;
      else item.qty++;
      if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
      updateCartUI();
    })
  });

  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  cartTotalEl.textContent = total.toFixed(2) + ' ₺';
}

// cart open/close
cartBtn.addEventListener('click', ()=> cartModal.classList.remove('hidden'));
closeCart.addEventListener('click', ()=> cartModal.classList.add('hidden'));
cartModal.addEventListener('click', (e)=> { if(e.target === cartModal) cartModal.classList.add('hidden') });

// checkout via WhatsApp
checkoutWhats.addEventListener('click', ()=> {
  if(cart.length === 0) { alert('Sepetin boş.'); return; }
  const lines = cart.map(i => `${i.qty} x ${i.title} (${i.price.toFixed(2)} ₺)`);
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2);
  const message = `Merhaba, EAK Streetwear sipariş yapmak istiyorum.%0A${lines.join('%0A')}%0AToplam: ${total} ₺%0Aİsim:%0ATelefon:%0AAdres:`;
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g,'')}?text=${message}`;
  window.open(url, '_blank');
});

// checkout via Email (mailto)
checkoutEmail.addEventListener('click', ()=> {
  if(cart.length === 0) { alert('Sepetin boş.'); return; }
  const lines = cart.map(i => `${i.qty} x ${i.title} (${i.price.toFixed(2)} ₺)`).join('%0A');
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2);
  const subject = encodeURIComponent('EAK Streetwear Sipariş');
  const body = encodeURIComponent(`Sipariş:%0A${lines}%0AToplam: ${total} ₺%0A%0AIsim:%0ATelefon:%0AAdres:`);
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

// init year and products
document.getElementById('year').textContent = new Date().getFullYear();
renderProducts();
updateCartUI();
