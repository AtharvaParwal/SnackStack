const { FoodItems } = require("../models/FoodItems");

function getCartItems(itempairs) {
    var items = [];
    for (let i = 0; i < itempairs.length; i++) {
        var item = itempairs[i].item;
        var quantity = itempairs[i].quantity;
        FoodItems.findbyId(item, function (err, fooditem) {
            if (err) {
                console.log(err);
            }
            else {
                items.push({ item: fooditem.name, quantity: quantity });
            }
        });
    }
    return items;
}

function getCartTotal(itempairs) {
    var total = 0;
    for (let i = 0; i < itempairs.length; i++) {
        var item = itempairs[i].item;
        var quantity = itempairs[i].quantity;
        FoodItems.findbyId(item, function (err, fooditem) {
            if (err) {
                console.log(err);
            }
            else {
                total = total + (fooditem.price * quantity);
            }
        });
    }
    return total;
}

function UpdateAvgRating(item_id, rating) {
    FoodItems.findById(item_id, function (err, fooditem) {
        if (err) {
            console.log(err);
        }
        else {
            // var newRating = (fooditem.rating * fooditem.totalreviews + rating) / (fooditem.totalreviews + 1);
            // fooditem.rating = newRating;
            // fooditem.totalreviews = fooditem.totalreviews + 1;
            // fooditem.save();
            return fooditem;
        }
    });
}

module.exports = { getCartItems, getCartTotal, UpdateAvgRating };

