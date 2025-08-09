// backend/middlewares/cartitems.js
const { FoodItem } = require("../models/FoodItems");

// Return array: [{ item: <fooditemDoc>, quantity }]
async function getCartItems(itempairs = []) {
  try {
    const results = await Promise.all(itempairs.map(async ({ item, quantity }) => {
      const fooditem = await FoodItem.findById(item).lean();
      if (!fooditem) return null;
      return { item: fooditem, quantity };
    }));
    return results.filter(Boolean);
  } catch (err) {
    console.error("getCartItems error:", err);
    return [];
  }
}

// Accepts either enrichedItems (from getCartItems) or raw itempairs [{item: id, quantity}]
async function getCartTotal(itemsOrPairs = []) {
  try {
    // If input looks enriched (item is object with price):
    if (itemsOrPairs.length > 0 && itemsOrPairs[0].item && typeof itemsOrPairs[0].item.price === "number") {
      return itemsOrPairs.reduce((acc, { item, quantity }) => acc + (item.price * quantity), 0);
    }

    // Otherwise treat as raw pairs and resolve each item's price
    const arr = await Promise.all(itemsOrPairs.map(async ({ item, quantity }) => {
      const fooditem = await FoodItem.findById(item).lean();
      return fooditem ? (fooditem.price * quantity) : 0;
    }));
    return arr.reduce((a, b) => a + b, 0);
  } catch (err) {
    console.error("getCartTotal error:", err);
    return 0;
  }
}

// Update average rating and save (example behavior)
async function UpdateAvgRating(item_id, rating) {
  try {
    if (!item_id || rating < 1 || rating > 5) {
      throw new Error("Invalid item_id or rating (must be 1-5)");
    }

    const fooditem = await FoodItem.findById(item_id);
    if (!fooditem) return null;

    fooditem.totalreviews = (fooditem.totalreviews || 0) + 1;
    fooditem.rating = ((fooditem.rating || 0) * (fooditem.totalreviews - 1) + rating) / fooditem.totalreviews;

    await fooditem.save();
    return fooditem;
  } catch (err) {
    console.error("UpdateAvgRating error:", err);
    return null;
  }
}

// Validate cart items availability
async function validateCartItems(itempairs = []) {
  try {
    const results = await Promise.all(itempairs.map(async ({ item, quantity }) => {
      const fooditem = await FoodItem.findById(item).lean();
      if (!fooditem) {
        return { valid: false, error: `Item ${item} not found`, item };
      }
      if (quantity <= 0) {
        return { valid: false, error: "Quantity must be greater than 0", item };
      }
      return { valid: true, item: fooditem, quantity };
    }));
    
    const invalidItems = results.filter(r => !r.valid);
    return {
      isValid: invalidItems.length === 0,
      invalidItems,
      validItems: results.filter(r => r.valid)
    };
  } catch (err) {
    console.error("validateCartItems error:", err);
    return { isValid: false, error: err.message };
  }
}

// Calculate cart summary with details
async function getCartSummary(itempairs = []) {
  try {
    const enrichedItems = await getCartItems(itempairs);
    const total = await getCartTotal(enrichedItems);
    const itemCount = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      items: enrichedItems,
      total,
      itemCount,
      uniqueItems: enrichedItems.length
    };
  } catch (err) {
    console.error("getCartSummary error:", err);
    return { items: [], total: 0, itemCount: 0, uniqueItems: 0 };
  }
}

module.exports = { getCartItems, getCartTotal, UpdateAvgRating, validateCartItems, getCartSummary };



// const { FoodItems } = require("../models/FoodItems");

// function getCartItems(itempairs) {
//     var items = [];
//     for (let i = 0; i < itempairs.length; i++) {
//         var item = itempairs[i].item;
//         var quantity = itempairs[i].quantity;
//         FoodItems.findbyId(item, function (err, fooditem) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 items.push({ item: fooditem.name, quantity: quantity });
//             }
//         });
//     }
//     return items;
// }

// function getCartTotal(itempairs) {
//     var total = 0;
//     for (let i = 0; i < itempairs.length; i++) {
//         var item = itempairs[i].item;
//         var quantity = itempairs[i].quantity;
//         FoodItems.findbyId(item, function (err, fooditem) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 total = total + (fooditem.price * quantity);
//             }
//         });
//     }
//     return total;
// }

// function UpdateAvgRating(item_id, rating) {
//     FoodItems.findById(item_id, function (err, fooditem) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // var newRating = (fooditem.rating * fooditem.totalreviews + rating) / (fooditem.totalreviews + 1);
//             // fooditem.rating = newRating;
//             // fooditem.totalreviews = fooditem.totalreviews + 1;
//             // fooditem.save();
//             return fooditem;
//         }
//     });
// }
// module.exports = { getCartItems, getCartTotal, UpdateAvgRating };

