function get_current_time() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    return hour + ":" + min + ":" + sec;
}

function check_if_shop_open(open_time, close_time) {
    var open_tim_min = open_time.split(":")[1];
    var open_tim_hr = open_time.split(":")[0];
    var close_tim_min = close_time.split(":")[1];
    var close_tim_hr = close_time.split(":")[0];
    var current_time = get_current_time();
    var current_tim_min = current_time.split(":")[1];
    var current_tim_hr = current_time.split(":")[0];

    if (current_tim_hr < open_tim_hr) {
        return false;
    } else if (current_tim_hr > close_tim_hr) {
        return false;
    } else if (current_tim_hr == open_tim_hr && current_tim_hr == close_tim_hr) {
        if (current_tim_min < open_tim_min || current_tim_min > close_tim_min) {
            return false;
        } else {
            return true;
        }
    }
    else if (current_tim_hr == open_tim_hr) {
        if (current_tim_min < open_tim_min) {
            return false;
        } else {
            return true;
        }
    }
    else if (current_tim_hr == close_tim_hr) {
        if (current_tim_min > close_tim_min) {
            return false;
        } else {
            return true;
        }
    }
    else {
        return true;
    }
}

module.exports = { check_if_shop_open, get_current_time };