const top5items = (orders) => {
    if (!orders || orders.length === 0) return [];
    
    // Group by item name and sum quantities
    let result = orders.reduce((r, a) => {
        if (a.item && a.quantity) {
            r[a.item] = [...r[a.item] || [], a];
        }
        return r;
    }, {});
    
    const list = [];
    for (let k in result) {
        var count = 0;
        for (let i = 0; i < result[k].length; i++) {
            count = count + (result[k][i].quantity || 0);
        }
        if (count > 0) {
            list.push([k, count]);
        }
    }
    
    list.sort((a, b) => b[1] - a[1]);
    return list.slice(0, 5);
};

const getOrdersPlaced = (orders) => {
    return orders ? orders.length : 0;
}

const getPendingOrders = (orders) => {
    if (!orders) return 0;
    
    return orders.filter(order => 
        order.status && !["COMPLETED", "REJECTED"].includes(order.status)
    ).length;
}

const getCompletedOrders = (orders) => {
    if (!orders) return 0;
    
    return orders.filter(order => order.status === "COMPLETED").length;
}

const checkSpaceAvailable = (orders) => {
    if (!orders) return true;
    
    const activeOrders = orders.filter(order => 
        order.status && ["ACCEPTED", "COOKING"].includes(order.status)
    ).length;
    
    return activeOrders < 10;
}

const getCompletedOrderVsAge = (orders) => {
    if (!orders || orders.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Orders by Age',
                data: [],
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2
            }]
        };
    }

    let result = {};
    
    orders.forEach(order => {
        if (order.status === "COMPLETED" && order.buyer && order.buyer[0] && order.buyer[0].age) {
            const ageGroup = Math.floor(order.buyer[0].age / 5) * 5; // Group by 5-year intervals
            const ageLabel = `${ageGroup}-${ageGroup + 4}`;
            result[ageLabel] = (result[ageLabel] || 0) + 1;
        }
    });

    let labels = Object.keys(result).sort();
    let data = labels.map(label => result[label]);

    return {
        labels: labels,
        datasets: [{
            label: 'Orders by Age Group',
            data: data,
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2
        }]
    };
}

const getCompletedOrderVsBatchNumber = (orders) => {
    if (!orders || orders.length === 0) {
        return {
            labels: [],
            datasets: [{
                label: 'Orders by Batch',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2
            }]
        };
    }

    let result = {};
    
    orders.forEach(order => {
        if (order.status === "COMPLETED" && order.buyer && order.buyer[0] && order.buyer[0].batchNumber) {
            const batch = order.buyer[0].batchNumber;
            result[batch] = (result[batch] || 0) + 1;
        }
    });

    let labels = Object.keys(result).sort();
    let data = labels.map(label => result[label]);

    return {
        labels: labels,
        datasets: [{
            label: 'Orders by Batch',
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 205, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2
        }]
    };
}

// Additional utility functions for better analytics
const getRevenueStats = (orders) => {
    if (!orders) return { total: 0, today: 0, average: 0 };
    
    const completedOrders = orders.filter(order => order.status === "COMPLETED");
    const total = completedOrders.reduce((sum, order) => sum + (order.cost || 0), 0);
    
    const today = new Date().toDateString();
    const todayOrders = completedOrders.filter(order => 
        order.placedTime && new Date(order.placedTime).toDateString() === today
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.cost || 0), 0);
    
    const average = completedOrders.length > 0 ? total / completedOrders.length : 0;
    
    return { total, today: todayRevenue, average };
}

const getOrderStatusDistribution = (orders) => {
    if (!orders) return {};
    
    const distribution = {};
    orders.forEach(order => {
        if (order.status) {
            distribution[order.status] = (distribution[order.status] || 0) + 1;
        }
    });
    
    return distribution;
}

export { 
    top5items, 
    getOrdersPlaced, 
    getPendingOrders, 
    getCompletedOrders, 
    checkSpaceAvailable, 
    getCompletedOrderVsAge, 
    getCompletedOrderVsBatchNumber,
    getRevenueStats,
    getOrderStatusDistribution
};