function get_current_time() {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    const sec = date.getSeconds().toString().padStart(2, "0");
    return `${hour}:${min}:${sec}`;
}

function check_if_shop_open(open_time, close_time) {
    const [openHr, openMin] = open_time.split(":").map(Number);
    const [closeHr, closeMin] = close_time.split(":").map(Number);
    const [currHr, currMin] = get_current_time().split(":").map(Number);

    const openMinutes = openHr * 60 + openMin;
    const closeMinutes = closeHr * 60 + closeMin;
    const currentMinutes = currHr * 60 + currMin;

    if (closeMinutes >= openMinutes) {
        // Normal case (e.g., 9:00 - 18:00)
        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    } else {
        // Overnight case (e.g., 20:00 - 05:00)
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }
}

function get_current_timestamp() {
    return new Date().toISOString();
}

// Get formatted date (YYYY-MM-DD)
function get_current_date() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Calculate estimated delivery time (in minutes)
function calculate_delivery_time(base_time = 30, item_count = 1) {
    // Base time + 2 minutes per additional item (capped at 60 minutes)
    const estimated = base_time + Math.max(0, (item_count - 1) * 2);
    return Math.min(estimated, 60);
}

// Check if time is within business hours for any vendor
function is_within_business_hours(start_hour = 8, end_hour = 22) {
    const currentHour = new Date().getHours();
    return currentHour >= start_hour && currentHour < end_hour;
}

// Format time for display (12-hour format)
function format_time_12h(time_24h) {
    const [hour, minute] = time_24h.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

function get_time_difference_minutes(start_time, end_time) {
    const [startHr, startMin] = start_time.split(":").map(Number);
    const [endHr, endMin] = end_time.split(":").map(Number);
    
    const startMinutes = startHr * 60 + startMin;
    const endMinutes = endHr * 60 + endMin;
    
    return Math.abs(endMinutes - startMinutes);
}

module.exports = { 
    check_if_shop_open, 
    get_current_time,
    get_current_timestamp,
    get_current_date,
    calculate_delivery_time,
    is_within_business_hours,
    format_time_12h,
    get_time_difference_minutes
};
