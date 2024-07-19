// Modals
const adminLoginForm = document.getElementById('form-login');
const orderConfirmationModal = document.getElementById('order-confirmation-modal');
const completeOrderModal = document.getElementById('complete-order-modal');

// Load orders from localStorage
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let incoming = JSON.parse(localStorage.getItem('incoming')) || [];
let cart = [];
let total = 0;

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
								<th>Price</th>
						</tr>
						${cart.map(item => `
								<tr>
										<td>${item.menu}</td>
										<td>${item.quantity}</td>
										<td>${item.price * item.quantity}</td>
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
		const orderCode = generateOrderCode();
		
		document.getElementById('customer-details').innerText = `Name: ${name}\nPhone: ${phone}`;
		document.getElementById('order-code-display').innerText = orderCode;
		
		const orderSummaryTable = document.getElementById('order-summary-table');
		orderSummaryTable.innerHTML = `
				<tr>
						<th>Menu</th>
						<th>Quantity</th>
				</tr>
				${cart.map(item => `
						<tr>
								<td>${item.menu}</td>
								<td>${item.quantity}</td>
						</tr>
				`).join('')}
		`;
		
		orderConfirmationModal.showModal();
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
		displayCart();
		orderConfirmationModal.close();
		alert(`Order placed! Your order code is: ${orderCode}`);
}

// Initialize the page
displayCart();

// Modal buttons event listeners
document.getElementById('confirm-order-btn').addEventListener('click', placeOrder);
document.getElementById('cancel-order-btn').addEventListener('click', () => orderConfirmationModal.close());

// Login form
// document.getElementById('form-login').addEventListener('submit', (e) => {
// 	e.preventDefault();
// 	const username = document.getElementById('username').value;
// 	const password = document.getElementById('password').value;
// 	if (username === 'admin' && password === 'admin') {
// 		alert('Login successful!');
// 		window.location.href = "../html/admin.html";
// 		// showIncomingOrders();
// 	} else {
// 		alert('Invalid credentials');
// 	}
// });

adminLoginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let uname = 'admin';
	let pw = 'admin';
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	if (username === uname) {
		if (password === pw){
			alert('Login successful!');
			window.location.href = "../html/admin.html";
		} else {
			alert('Password anda salah!')
		}
	} else {
		alert('Ada kesalahan!');
	}
});

function showIncomingOrders() {
	const incomingOrdersSection = document.getElementById('incoming-orders-section');
	if (incoming.length === 0) {
		incomingOrdersSection.innerHTML = '<h2>No incoming orders</h2>';
		return;
	}
	incomingOrdersSection.innerHTML = `
		<h2>Incoming Orders</h2>
		<table>
			<tr>
				<th>Name</th>
				<th>Phone</th>
				<th>Items</th>
				<th>Order Code</th>
				<th>Action</th>
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
					<td><button onclick="openCompleteOrderModal('${order.code}')">Pesanan Selesai</button></td>
				</tr>
			`).join('')}
		</table>
	`;
}