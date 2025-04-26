const CART_KEY = 'cart_items';

const cartService = {
    // Get all items from cart
    getCartItems: () => {
        const items = localStorage.getItem(CART_KEY);
        return items ? JSON.parse(items) : [];
    },

    // Add item to cart
    addToCart: (product, quantity = 1) => {
        const items = cartService.getCartItems();
        const existingItem = items.find(item => item.productId === product._id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                discount: product.discount || 0
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(items));
        return items;
    },

    // Update item quantity
    updateQuantity: (productId, quantity) => {
        const items = cartService.getCartItems();
        const item = items.find(item => item.productId === productId);
        
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                const index = items.indexOf(item);
                items.splice(index, 1);
            }
        }

        localStorage.setItem(CART_KEY, JSON.stringify(items));
        return items;
    },

    // Remove item from cart
    removeFromCart: (productId) => {
        const items = cartService.getCartItems();
        const updatedItems = items.filter(item => item.productId !== productId);
        localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
        return updatedItems;
    },

    // Clear cart
    clearCart: () => {
        localStorage.removeItem(CART_KEY);
        return [];
    },

    // Get cart total
    getCartTotal: () => {
        const items = cartService.getCartItems();
        return items.reduce((total, item) => {
            const price = item.price * (1 - item.discount / 100);
            return total + (price * item.quantity);
        }, 0);
    },

    // Get total items count
    getItemsCount: () => {
        const items = cartService.getCartItems();
        return items.reduce((total, item) => total + item.quantity, 0);
    }
};

export default cartService; 