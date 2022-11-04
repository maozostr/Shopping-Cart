import { products } from "./products-list.js";
import { Cart } from "./Cart.js"

const productsListDiv = document.querySelector(".products_list")
const cartListDiv = document.querySelector(".cart_list")
const cartItemsCountSpan = document.querySelector(".cart_items_count")
const cartTotalPriceSpan = document.querySelector(".cart_total_price")

const openCheckoutBtn = document.querySelector(".checkout_btn")

const modalCheckoutCartListUl = document.querySelector(".checkout_cart_items")
const modalCheckoutCartItemsCountSpan = document.querySelector(".checkout_cart_items_count")
const modalCheckoutCartTotalPriceStrong = document.querySelector(".checkout_cart_total_price")

const modalTitleProductH1 = document.querySelector(".modal_title_product")
const modalBodyProductDiv = document.querySelector(".modal_body_product")

const checkoutForm = document.querySelector(".checkout_form")
const promotionForm = document.querySelector(".promotion_form")

const shippingInfoP = document.querySelector(".shipping_info")

const successAlertDiv = document.querySelector(".alert-success")
const closeSuccessAlertBtn = document.querySelector(".close_success_alert_btn")

openCheckoutBtn.addEventListener("click", onOpenCheckoutModal)
checkoutForm.addEventListener("submit", onCheckoutSubmit)
promotionForm.addEventListener("submit", onPromotionSubmit)
closeSuccessAlertBtn.addEventListener("click", onCloseSuccessAlert)


const cart = new Cart()

displayProducts()

function onPromotionSubmit(event) {
   event.preventDefault()
   const data = new FormData(event.target)
   modalCheckoutCartTotalPriceStrong.textContent = `$${cart.totalPrice - 5}`
}

function onCheckoutSubmit(event) {
   event.preventDefault()

   const data = new FormData(event.target)

   successAlertDiv.classList.remove("hide")

   for (const pair of data.entries()) {
      shippingInfoP.textContent += `${pair[0]}: ${pair[1]}  ,`
   }

   openCheckoutBtn.classList.add("hide")

   clearContainer(modalCheckoutCartListUl)
   clearContainer(cartListDiv)

   cartItemsCountSpan.textContent = 0
   cartTotalPriceSpan.textContent = `Total: $0`

   cart.reset()
}

function onCloseSuccessAlert() {
   successAlertDiv.classList.add("hide")
   shippingInfoP.textContent = ""
}

function onOpenCheckoutModal() {
   modalCheckoutCartItemsCountSpan.textContent = cart.items.size
   modalCheckoutCartTotalPriceStrong.textContent = `$${cart.totalPrice}`

   clearContainer(modalCheckoutCartListUl)

   cart.items.forEach((item) => {
      modalCheckoutCartListUl.insertAdjacentHTML("afterbegin", createCheckoutCartItemElement(item))
   })
}

function displayProducts() {
   for (const product of products) {
      productsListDiv.insertAdjacentHTML("afterbegin", createProductElement(product))
      document.getElementById(product.id).addEventListener("click", onProductActions.bind(null, product))
   }
}

function onProductActions(product, event) {
   const target = event.target
   if (target.classList.contains("add_to_cart_btn")) {
      return onAddCartItem(product)
   }
   if (target.classList.contains("like_btn")) {
      return toggleProductLike(target)
   }

   if (target.classList.contains("card-img-top")) {
      return onShowProductInfo(product)
   }
}

function onCartItemActions(cartItem, cartItemElement, event) {
   const target = event.target
   if (target.classList.contains("delete_cart_item_btn") && event.type === "click") {
      return onRemoveCartItem(cartItem, event)
   }

   if (target.classList.contains("cart_item_quantity_input") && event.type === "input") {
      return onUpdateCartItemQuantity(cartItemElement, cartItem)
   }
}

function onShowProductInfo(product) {
   modalTitleProductH1.textContent = product.name

   clearContainer(modalBodyProductDiv)

   modalBodyProductDiv.insertAdjacentHTML("afterbegin", createModalProductElement(product))
}

function toggleProductLike(target) {
   target.classList.toggle("red_color")
}

function onAddCartItem(product) {

   const cartItem = cart.addItem(product)

   const cartItemElement = document.getElementById(cartItem.id)

   if (cartItemElement) {
      updateCartItemElement(cartItemElement, cartItem)
   } else {
      cartListDiv.insertAdjacentHTML("afterbegin", createCartItemElement(cartItem))
      cartItemsCountSpan.textContent = cart.items.size
      cartTotalPriceSpan.textContent = `Total: $${cart.totalPrice}`

      const cartItemElement = document.getElementById(cartItem.id)

      cartItemElement.addEventListener("click", onCartItemActions.bind(null, cartItem, cartItemElement))
      cartItemElement.addEventListener("input", onCartItemActions.bind(null, cartItem, cartItemElement))
   }

   openCheckoutBtn.classList.remove("hide")
}

function onRemoveCartItem(cartItem) {
   document.getElementById(cartItem.id).remove()
   cart.removeItem(cartItem.productId)
   cartItemsCountSpan.textContent = cart.items.size
   cartTotalPriceSpan.textContent = `Total: $${cart.totalPrice}`

   if (cart.items.size === 0) {
      openCheckoutBtn.classList.add("hide")
   }
}

function onUpdateCartItemQuantity(cartItemElement, cartItem) {
   const quantityInput = cartItemElement.querySelector(".cart_item_quantity_input")
   const quantityInputValue = Number(quantityInput.value)

   quantityInput.onblur = function () {
      if (quantityInputValue === "" || quantityInputValue <= 0) {
         quantityInput.value = cartItem.quantity
      }
   }

   if (quantityInputValue <= 0) {
      return
   }

   const cartItemUpdated = cart.updateQuantity(cartItem, quantityInputValue)
   if (cartItemUpdated) {
      updateCartItemElement(cartItemElement, cartItemUpdated, quantityInputValue)
   }
}

function updateCartItemElement(cartItemElement, cartItem) {
   const cartItemPriceP = cartItemElement.querySelector(".cart_item_price")
   const cartItemQuantityInput = cartItemElement.querySelector(".cart_item_quantity_input")
   console.log(cartItem)
   cartItemQuantityInput.value = cartItem.quantity
   cartItemPriceP.textContent = `${cartItem.price} X ${cartItem.quantity} = $${cartItem.price * cartItem.quantity}`
   cartTotalPriceSpan.textContent = `Total: $${cart.totalPrice}`
}


function createModalProductElement(product) {
   return `
   <div class="card mb-3 modal_product">
   <img src="${product.imagePath}" class="card-img" alt="...">
   <div class="card-body">
     <p class="card-text">${product.description}</p>
     <p class="card-text"><h4 class="text-muted">$${product.price}</h4></p>
   </div>
 </div>
   `
}

function createProductElement(product) {
   return `
       <div class="col product_item" id=${product.id}>
       <div class="card shadow-sm">
       <img  src="${product.imagePath}" class="card-img-top cursor-pointer" data-bs-toggle="modal" data-bs-target="#staticBackdrop" alt="...">
   
          <div class="card-body">
          <h5>${product.name}</h5>
            
             <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                   <button  type="button" class="btn btn-sm btn-outline-secondary add_to_cart_btn" style="margin-right:0.5rem">
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor"
                         class="bi bi-cart3 add_to_cart_btn"
                         viewBox="0 0 16 16">
                         <path
                         class="add_to_cart_btn"
                            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                      </svg>
                   </button>
                   <button type="button" class="btn btn-sm btn-outline-secondary like_btn">
                     <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" 
                     class="bi bi-heart-fill toggleLike" 
                     viewBox="0 0 16 16">
                           <path class="like_btn" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                     </svg>
                   </button>
                </div>
                <small class="text">$${product.price}</small>
             </div>
          </div>
       </div>
    </div>
       `
}

function createCartItemElement(cartItem) {
   return `
         <div id="${cartItem.id}" class="cart_item list-group-item list-group-item-action d-flex gap-3 py-3 bg-dark text-white mt-3"
         aria-current="true">
         <img class="cart_item_image" style="object-fit: cover;" src="${cartItem.imagePath}" alt="twbs" width="40" height="40"
            class="rounded-circle flex-shrink-0">
         <div class="d-flex gap-2 align-items-center w-100 justify-content-between">
            <div>
               <h6 class="mb-0">${cartItem.name}</h6>
               <p class="cart_item_price mb-0 opacity-75">${cartItem.price} X ${cartItem.quantity} = $${cartItem.price}</p>
            </div>

               <div class="d-flex align-items-center gap-2">
                    <small>Quantity</small>
                     <input min="1" style="width: 100px;"  class="form-control bg-dark text-white cart_item_quantity_input" type="number" value="${cartItem.quantity}"/>
                  
               </div>

            <small role="button" class="btn btn-dark delete_cart_item_btn opacity-70 text-nowrap">
               <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="delete_cart_item_btn bi bi-trash" viewBox="0 0 16 16">
                  <path class="delete_cart_item_btn" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path class="delete_cart_item_btn" fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
               </svg>
            </small>
         </div>
      </div>
      `
}


function createCheckoutCartItemElement(cartItem) {
   return `
   <li class="list-group-item d-flex justify-content-between lh-sm">
   <div>
      <h6 class="my-0">${cartItem.name}</h6>
   </div>
   <span class="text-muted">$${cartItem.price} X ${cartItem.quantity} = $${cartItem.price * cartItem.quantity}</span>
</li>
   `
}


function clearContainer(selector) {
   const container = typeof selector === "string" ? document.querySelector(selector) : selector

   while (container.firstChild) {
      container.firstChild.remove()
   }
}


{/* <small role="button"> */ }
{/* <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16"> */ }
{/* <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/> */ }
{/* </svg> */ }
{/* </small> */ }

{/* <small role="button">
<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
</svg>
</small>   */}