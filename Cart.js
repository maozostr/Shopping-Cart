export class Cart {
   constructor() {
      this.items = new Map()
      this.totalPrice = 0
   }

   addItem(product) {
      const itemFound = this.items.get(product.id)

      if (itemFound) {
         itemFound.quantity++
         this.items.set(itemFound.productId, itemFound)
         this.totalPrice += itemFound.price

         return itemFound
      } else {
         const newCartItem = this.createCartItem(product)
         this.items.set(newCartItem.productId, newCartItem)

         this.totalPrice += newCartItem.price
         return newCartItem
      }
   }

   updateQuantity(cartItem, quantity) {
      const itemFound = this.items.get(cartItem.productId)

      if (!itemFound) return

      this.totalPrice -= (itemFound.price * itemFound.quantity)

      itemFound.quantity = Number(quantity)

      this.totalPrice += (itemFound.quantity * itemFound.price)

      this.items.set(cartItem.productId, itemFound)

      return itemFound
   }

   removeItem(productId) {
      const cartItem = this.items.get(productId)

      this.totalPrice -= cartItem.price * cartItem.quantity

      this.items.delete(productId)

   }

   createCartItem(product) {
      return new CartItem(product)
   }

   reset() {
      this.items.clear()
      this.totalPrice = 0
   }
}


class CartItem {
   constructor(product) {
      this.id = Math.floor(Math.random() * 1000000000)
      this.name = product.name
      this.price = product.price
      this.quantity = 1
      this.imagePath = product.imagePath
      this.productId = product.id
   }
}