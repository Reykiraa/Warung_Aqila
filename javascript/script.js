// Initialitazion
const orderConfirmationModal = document.getElementById('order-confirmation-modal');
const completeOrderModal = document.getElementById('complete-order-modal');
const incomingOrdersSection = document.getElementById('incoming-orders-section');

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let incoming = JSON.parse(localStorage.getItem('incoming')) || [];
let cart = [];
let total = 0;
let revenue = 0;

// Function to generate unique order code
function generateOrderCode() {
  return Math.random().toString(36).substr(2, 5);
}

// Function to add item to cart
function addToCart(menu, price) {
  const existingItem = cart.find(item => item.menu === menu);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ menu, price, quantity: 1 });
  }
	total += price;
    displayCart();
}

// Function to display cart
function displayCart() {
  const cartDiv = document.getElementById('cart');
  if (cart.length === 0) {
    cartDiv.innerHTML = '<h2>Cart is empty</h2>';
    return;
  }
  cartDiv.innerHTML = `
    <h2>Cart</h2>
    <table>
      <tr>
        <th>Menu</th>
        <th>Quantity</th>
        <th>&emsp;Price</th>
      </tr>
      ${cart.map(item => `
      <tr>
        <td>${item.menu}</td>
        <td align="center">${item.quantity}</td>
        <td align="center">&emsp;${item.price * item.quantity}</td>
      </tr>
      `).join('')}
    </table>
    <button class="orderBtn" onclick="openOrderConfirmationModal()">Order</button>
  `;
}

// Function to open order confirmation modal
function openOrderConfirmationModal() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    if (name === '' || phone === ''){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Name and phone number must be filled!"
      });
      return;
    } else if (phone < 1){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Phone number can't be zero or negative!"
      });
      return;
    }

    const orderCode = generateOrderCode();
    
    document.getElementById('customer-details').innerText = `Name: ${name}\nPhone: ${phone}`;
    document.getElementById('order-code-display').innerText = orderCode;
    
    const orderSummaryTable = document.getElementById('order-summary-table');
    orderSummaryTable.innerHTML = `
      <tr>
        <th>Quantity</th>
        <th>Menu</th>
      </tr>
      ${cart.map(item => `
      <tr>
        <td>${item.price} x ${item.quantity}</td>
        <td>${item.menu}</td>
      </tr>
      `).join('')}
      <tr>
        <td colspan="2" align="right">Total : Rp${total}</td>
      </tr>
    `;
    orderConfirmationModal.showModal();
    // Modal buttons event listeners
    document.getElementById('confirm-order-btn').addEventListener('click', placeOrder);
    document.getElementById('cancel-order-btn').addEventListener('click', () => orderConfirmationModal.close());

}

// Function to place order
function placeOrder() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const orderCode = document.getElementById('order-code-display').innerText;
    const orderData = { code: orderCode, name, phone, items: cart, completed: false };
    incoming.push(orderData);
    localStorage.setItem('incoming', JSON.stringify(incoming));
    cart = [];
    revenue += total;
    console.log(revenue);
    displayCart();
    orderConfirmationModal.close();
    Swal.fire({
      title: "Order Placed!",
      html: `
        Your order code is: <b>${orderCode}</b>.
        <br>Please screenshot your order code and call 082124793703 for detail information.
      `,
      text: "",
      icon: "success"
    });
    // alert(`Order placed! Your order code is: ${orderCode}`);
}

function showIncomingOrders() {
  if (incoming.length === 0) {
    incomingOrdersSection.innerHTML = '<h2>No incoming orders</h2>';
    return;
  } else {
    incomingOrdersSection.innerHTML = `
    <h2>HISTORY ORDERS</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Items</th>
        <th>Order Code</th>
      </tr>
      ${incoming.map(order => `
        <tr>
          <td>${order.name}</td>
          <td>${order.phone}</td>
          <td>
            <ul>
              ${order.items.map(item => `
                <li>${item.menu} x${item.quantity}</li>
              `).join('')}
            </ul>
          </td>
          <td>${order.code}</td>
        </tr>
      `).join('')}
    </table>
    `;  
  }
  
}

// Initialize the page
showIncomingOrders();
displayCart();

