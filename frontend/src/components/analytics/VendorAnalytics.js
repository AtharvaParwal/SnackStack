import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Chip,
    LinearProgress,
    Stack,
    Divider
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
    Area,
    AreaChart,
    ComposedChart,
    RadialBarChart,
    RadialBar,
    ScatterChart,
    Scatter
} from 'recharts';
import { 
    TrendingUp, 
    ShoppingCart, 
    AttachMoney, 
    Restaurant,
    Analytics,
    Schedule
} from '@mui/icons-material';

const VendorAnalytics = ({ orders, vendorStats }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (orders && orders.length > 0) {
            processChartData();
        }
    }, [orders]);

    const processChartData = () => {
        // Daily revenue data
        const dailyRevenue = processDailyRevenueData();
        
        // Status distribution
        const statusData = processStatusData();
        
        // Hourly orders
        const hourlyData = processHourlyData();
        
        // Top items
        const topItems = processTopItemsData();
        
        // Monthly trend
        const monthlyTrend = processMonthlyTrend();

        // Revenue vs Orders correlation
        const revenueOrdersCorrelation = processRevenueOrdersCorrelation();

        // Weekly performance
        const weeklyPerformance = processWeeklyPerformance();

        // Customer satisfaction (rating data)
        const satisfactionData = processSatisfactionData();

        setChartData({
            dailyRevenue,
            statusData,
            hourlyData,
            topItems,
            monthlyTrend,
            revenueOrdersCorrelation,
            weeklyPerformance,
            satisfactionData
        });
    };

    const processDailyRevenueData = () => {
        const last7Days = {};
        const today = new Date();
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            last7Days[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
        }

        // Aggregate data
        orders.forEach(order => {
            if (order.status === 'COMPLETED') {
                const orderDate = new Date(order.placedTime);
                const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                if (last7Days[dateStr]) {
                    last7Days[dateStr].revenue += order.cost;
                    last7Days[dateStr].orders += 1;
                }
            }
        });

        return Object.values(last7Days);
    };

    const processStatusData = () => {
        const statusCount = {};
        const statusColors = {
            'PLACED': '#2196f3',
            'ACCEPTED': '#4caf50',
            'COOKING': '#ff9800',
            'READY FOR PICKUP': '#9c27b0',
            'COMPLETED': '#8bc34a',
            'REJECTED': '#f44336'
        };

        orders.forEach(order => {
            statusCount[order.status] = (statusCount[order.status] || 0) + 1;
        });

        return Object.entries(statusCount).map(([status, count]) => ({
            name: status.replace(/_/g, ' '),
            value: count,
            fill: statusColors[status] || '#gray'
        }));
    };

    const processHourlyData = () => {
        const hourlyCount = {};
        
        // Initialize 24 hours
        for (let i = 0; i < 24; i++) {
            hourlyCount[i] = { hour: `${i}:00`, orders: 0 };
        }

        orders.forEach(order => {
            const hour = new Date(order.placedTime).getHours();
            hourlyCount[hour].orders += 1;
        });

        return Object.values(hourlyCount);
    };

    const processTopItemsData = () => {
        const itemCount = {};
        
        orders.forEach(order => {
            if (order.status === 'COMPLETED') {
                itemCount[order.item] = (itemCount[order.item] || 0) + order.quantity;
            }
        });

        return Object.entries(itemCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([item, count]) => ({ name: item, sales: count }));
    };

    const processMonthlyTrend = () => {
        const monthlyData = {};
        
        orders.forEach(order => {
            if (order.status === 'COMPLETED') {
                const month = new Date(order.placedTime).toLocaleDateString('en-US', { month: 'short' });
                if (!monthlyData[month]) {
                    monthlyData[month] = { month, revenue: 0, orders: 0 };
                }
                monthlyData[month].revenue += order.cost;
                monthlyData[month].orders += 1;
            }
        });

        return Object.values(monthlyData);
    };

    const processRevenueOrdersCorrelation = () => {
        const last30Days = {};
        const today = new Date();
        
        // Initialize last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            last30Days[dateStr] = { date: dateStr, revenue: 0, orders: 0, avgOrderValue: 0 };
        }

        // Aggregate data
        orders.forEach(order => {
            if (order.status === 'COMPLETED') {
                const orderDate = new Date(order.placedTime);
                const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                if (last30Days[dateStr]) {
                    last30Days[dateStr].revenue += order.cost;
                    last30Days[dateStr].orders += 1;
                }
            }
        });

        // Calculate average order value
        Object.values(last30Days).forEach(day => {
            day.avgOrderValue = day.orders > 0 ? day.revenue / day.orders : 0;
        });

        return Object.values(last30Days);
    };

    const processWeeklyPerformance = () => {
        const weekData = {
            'Monday': { day: 'Mon', orders: 0, revenue: 0 },
            'Tuesday': { day: 'Tue', orders: 0, revenue: 0 },
            'Wednesday': { day: 'Wed', orders: 0, revenue: 0 },
            'Thursday': { day: 'Thu', orders: 0, revenue: 0 },
            'Friday': { day: 'Fri', orders: 0, revenue: 0 },
            'Saturday': { day: 'Sat', orders: 0, revenue: 0 },
            'Sunday': { day: 'Sun', orders: 0, revenue: 0 }
        };

        orders.forEach(order => {
            if (order.status === 'COMPLETED') {
                const dayName = new Date(order.placedTime).toLocaleDateString('en-US', { weekday: 'long' });
                if (weekData[dayName]) {
                    weekData[dayName].orders += 1;
                    weekData[dayName].revenue += order.cost;
                }
            }
        });

        return Object.values(weekData);
    };

    const processSatisfactionData = () => {
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRatings = 0;
        let totalScore = 0;

        orders.forEach(order => {
            if (order.rating && order.rating > 0) {
                const rating = Math.round(order.rating);
                if (rating >= 1 && rating <= 5) {
                    ratingCounts[rating]++;
                    totalRatings++;
                    totalScore += rating;
                }
            }
        });

        const avgRating = totalRatings > 0 ? (totalScore / totalRatings).toFixed(1) : 0;
        
        return {
            distribution: Object.entries(ratingCounts).map(([stars, count]) => ({
                stars: `${stars} ⭐`,
                count,
                percentage: totalRatings > 0 ? ((count / totalRatings) * 100).toFixed(1) : 0
            })),
            average: avgRating,
            total: totalRatings
        };
    };

    const MetricCard = ({ title, value, subtitle, icon, color = "primary" }) => (
        <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" color={color} sx={{ fontWeight: 'bold', mb: 1 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ color: `${color}.main`, opacity: 0.7 }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (!chartData.dailyRevenue) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Loading Analytics...
                </Typography>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
                📊 Vendor Analytics Dashboard
            </Typography>

            {/* Key Metrics Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Revenue"
                        value={`₹${vendorStats.totalRevenue?.toLocaleString() || 0}`}
                        subtitle="All time earnings"
                        icon={<AttachMoney sx={{ fontSize: 40 }} />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Today's Revenue"
                        value={`₹${vendorStats.todayRevenue?.toLocaleString() || 0}`}
                        subtitle={new Date().toDateString()}
                        icon={<TrendingUp sx={{ fontSize: 40 }} />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Orders"
                        value={vendorStats.totalOrders || 0}
                        subtitle="All time orders"
                        icon={<ShoppingCart sx={{ fontSize: 40 }} />}
                        color="info.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Avg Order Value"
                        value={`₹${vendorStats.avgOrderValue?.toFixed(2) || 0}`}
                        subtitle="Per order average"
                        icon={<Analytics sx={{ fontSize: 40 }} />}
                        color="warning.main"
                    />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={4}>
                {/* Daily Revenue Chart */}
                <Grid item xs={12} md={8}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="📈 Revenue & Orders Trend (Last 30 Days)"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={chartData.revenueOrdersCorrelation}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip 
                                        formatter={(value, name) => [
                                            name === 'revenue' ? `₹${value}` : 
                                            name === 'avgOrderValue' ? `₹${value.toFixed(2)}` : value,
                                            name === 'revenue' ? 'Revenue' : 
                                            name === 'avgOrderValue' ? 'Avg Order Value' : 'Orders'
                                        ]}
                                    />
                                    <Legend />
                                    <Area 
                                        yAxisId="left"
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#8884d8" 
                                        fill="#8884d8" 
                                        fillOpacity={0.3}
                                    />
                                    <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" />
                                    <Line 
                                        yAxisId="left"
                                        type="monotone" 
                                        dataKey="avgOrderValue" 
                                        stroke="#ff7300" 
                                        strokeWidth={3}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Customer Satisfaction */}
                <Grid item xs={12} md={4}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="⭐ Customer Satisfaction"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <Box textAlign="center" mb={2}>
                                <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                                    {chartData.satisfactionData?.average || 0}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Average Rating
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ({chartData.satisfactionData?.total || 0} reviews)
                                </Typography>
                            </Box>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData.satisfactionData?.distribution || []} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="stars" width={60} />
                                    <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
                                    <Bar dataKey="count" fill="#ffd700" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Weekly Performance Radar */}
                <Grid item xs={12} md={6}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="📅 Weekly Performance Pattern"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <ComposedChart data={chartData.weeklyPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip 
                                        formatter={(value, name) => [
                                            name === 'revenue' ? `₹${value}` : value,
                                            name === 'revenue' ? 'Revenue' : 'Orders'
                                        ]}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" />
                                    <Line 
                                        yAxisId="right"
                                        type="monotone" 
                                        dataKey="orders" 
                                        stroke="#82ca9d" 
                                        strokeWidth={3}
                                        dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Status Distribution */}
                <Grid item xs={12} md={6}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="📊 Order Status Distribution"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={chartData.statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent, value }) => 
                                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        animationDuration={1000}
                                    >
                                        {chartData.statusData?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Status Legend */}
                            <Box mt={2}>
                                <Grid container spacing={1}>
                                    {chartData.statusData?.map((status, index) => (
                                        <Grid item xs={6} key={index}>
                                            <Box display="flex" alignItems="center">
                                                <Box 
                                                    width={16} 
                                                    height={16} 
                                                    bgcolor={status.fill} 
                                                    borderRadius="50%" 
                                                    mr={1}
                                                />
                                                <Typography variant="caption">
                                                    {status.name}: {status.value}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Selling Items */}
                <Grid item xs={12} md={6}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="🏆 Top Selling Items"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={chartData.topItems}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [`${value} sold`, 'Quantity']}
                                        labelStyle={{ color: '#000' }}
                                        contentStyle={{ 
                                            backgroundColor: '#fff', 
                                            border: '1px solid #ccc',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="sales" 
                                        fill="#ff7c7c"
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Hourly Order Pattern */}
                <Grid item xs={12} md={6}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="⏰ Hourly Order Pattern"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={chartData.hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [`${value} orders`, 'Orders']}
                                        labelStyle={{ color: '#000' }}
                                        contentStyle={{ 
                                            backgroundColor: '#fff', 
                                            border: '1px solid #ccc',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.6}
                                        strokeWidth={3}
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Orders Activity */}
                <Grid item xs={12}>
                    <Card elevation={6}>
                        <CardHeader 
                            title="🕒 Recent Orders Activity"
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <Stack spacing={2}>
                                {orders.slice(0, 10).map((order, index) => (
                                    <Box key={order._id} sx={{ 
                                        p: 2, 
                                        border: '1px solid', 
                                        borderColor: 'grey.300',
                                        borderRadius: 2,
                                        backgroundColor: 'grey.50',
                                        '&:hover': { backgroundColor: 'grey.100' }
                                    }}>
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item xs={3}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {order.item}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Qty: {order.quantity}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography variant="h6" color="success.main">
                                                    ₹{order.cost}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Chip 
                                                    label={order.status.replace(/_/g, ' ')} 
                                                    color={
                                                        order.status === 'COMPLETED' ? 'success' :
                                                        order.status === 'REJECTED' ? 'error' :
                                                        order.status === 'COOKING' ? 'warning' : 'primary'
                                                    }
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(order.placedTime).toLocaleString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VendorAnalytics;
