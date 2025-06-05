const top5items = (orders) => {
    // group by item_id

    let result = orders.reduce((r, a) => {
        r[a.item] = [...r[a.item] || [], a];
        return r;
    }, {});
    const list = [];
    for (let k in result) {
        var count = 0;
        for (let i = 0; i < result[k].length; i++) {
            count = count + result[k][i].quantity;
        }
        list.push([k, count]);
    }
    list.sort((a, b) => {
        return b[1] - a[1];
    });
    let top5 = list.slice(0, 5);

    return top5;

};


const getOrdersPlaced = (orders) => {
    var count = orders.length;
    // for (let i = 0; i < orders.length; i++) {
    //     if (orders[i].status === "REJECTED") {
    //         count--;
    //     }
    // }
    return count;
}

const getPendingOrders = (orders) => {
    var count = orders.length;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].status === "COMPLETED" || orders[i].status === "REJECTED") {
            count--;
        }
    }
    return count;
}

const getCompletedOrders = (orders) => {
    var count = 0;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].status === "COMPLETED") {
            count++;
        }
    }
    return count;
}

const checkSpaceAvailable = (orders) => {
    var count = 0;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].status === "ACCEPTED" || orders[i].status === "COOKING") {
            count++;
        }
    }
    if (count < 10)
        return true;
    else
        return false;
}


const getCompletedOrderVsAge = (orders) => {

    let result = {};

    orders.forEach(order => {
        if (order.status === "COMPLETED") {
            if (order.buyer[0].age in result)
                result[order.buyer[0].age] += 1;
            else
                result[order.buyer[0].age] = 1;
        }
    });

    let labels = [];
    let data = [];

    // sort result by key
    let sortedResult = {};
    Object.keys(result).sort().forEach(function (key) {
        sortedResult[key] = result[key];
    });

    for (let key in sortedResult) {
        labels.push(key);
        data.push(result[key]);
    };

    return {
        labels: labels,
        datasets: [
            {
                label: 'Age',
                data: data,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2
            }
        ]
    };

}

const getCompletedOrderVsBatchNumber = (orders) => {
    let result = {};

    orders.forEach(order => {
        if (order.status === "COMPLETED") {
            if (order.buyer[0].batchNumber in result)
                result[order.buyer[0].batchNumber] += 1;
            else
                result[order.buyer[0].batchNumber] = 1;
        }
    });

    let labels = [];
    let data = [];

    // sort result by key
    let sortedResult = {};
    Object.keys(result).sort().forEach(function (key) {
        sortedResult[key] = result[key];
    });


    for (let key in sortedResult) {
        labels.push(key);
        data.push(result[key]);
    };

    return {
        labels: labels,
        datasets: [
            {
                label: 'Batch Number',
                data: data,
                backgroundColor: 'rgba(242,171,90,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2
            }
        ]
    };

}



export { top5items, getOrdersPlaced, getPendingOrders, getCompletedOrders, checkSpaceAvailable, getCompletedOrderVsAge, getCompletedOrderVsBatchNumber };