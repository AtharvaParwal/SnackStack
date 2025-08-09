import React from 'react';
import { 
    Stepper, 
    Step, 
    StepLabel, 
    StepContent, 
    Typography, 
    Chip, 
    Box,
    LinearProgress,
    Card,
    CardContent
} from '@mui/material';
import { 
    Restaurant,
    CheckCircle,
    Cancel,
    Schedule,
    LocalShipping
} from '@mui/icons-material';

const OrderTracker = ({ order }) => {
    const steps = [
        {
            label: 'Order Placed',
            status: 'PLACED',
            description: 'Your order has been placed successfully',
            icon: <Schedule />
        },
        {
            label: 'Order Accepted',
            status: 'ACCEPTED', 
            description: 'Vendor has accepted your order',
            icon: <CheckCircle />
        },
        {
            label: 'Cooking',
            status: 'COOKING',
            description: 'Your food is being prepared',
            icon: <Restaurant />
        },
        {
            label: 'Ready for Pickup',
            status: 'READY FOR PICKUP',
            description: 'Your order is ready! Please collect it',
            icon: <LocalShipping />
        },
        {
            label: 'Completed',
            status: 'COMPLETED',
            description: 'Order completed successfully',
            icon: <CheckCircle />
        }
    ];

    const getActiveStep = () => {
        if (order.status === 'REJECTED') return -1;
        return steps.findIndex(step => step.status === order.status);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'PLACED': 'info',
            'ACCEPTED': 'primary', 
            'COOKING': 'warning',
            'READY FOR PICKUP': 'secondary',
            'COMPLETED': 'success',
            'REJECTED': 'error'
        };
        return statusColors[status] || 'default';
    };

    const getProgress = () => {
        const activeStep = getActiveStep();
        if (activeStep === -1) return 0; // Rejected
        return ((activeStep + 1) / steps.length) * 100;
    };

    if (order.status === 'REJECTED') {
        return (
            <Card sx={{ mb: 2, borderLeft: '4px solid #f44336' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Cancel color="error" />
                        <Box>
                            <Typography variant="h6" color="error">
                                Order Rejected
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Unfortunately, your order has been rejected by the vendor.
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                        Order Status: <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status)} 
                            size="small"
                        />
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={getProgress()} 
                        sx={{ mb: 2, height: 8, borderRadius: 4 }}
                        color={order.status === 'COMPLETED' ? 'success' : 'primary'}
                    />
                </Box>

                <Stepper activeStep={getActiveStep()} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.status} completed={index <= getActiveStep()}>
                            <StepLabel
                                icon={step.icon}
                                sx={{
                                    '& .MuiStepIcon-root': {
                                        color: index <= getActiveStep() ? 'primary.main' : 'grey.300'
                                    }
                                }}
                            >
                                <Typography variant="subtitle1">{step.label}</Typography>
                            </StepLabel>
                            <StepContent>
                                <Typography variant="body2" color="text.secondary">
                                    {step.description}
                                </Typography>
                                {index === getActiveStep() && (
                                    <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                                        Current Status
                                    </Typography>
                                )}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>

                {order.status === 'READY FOR PICKUP' && (
                    <Box mt={2} p={2} bgcolor="warning.light" borderRadius={1}>
                        <Typography variant="body2" color="warning.dark">
                            🍽️ Your order is ready for pickup! Please collect it from the vendor.
                        </Typography>
                    </Box>
                )}

                {order.status === 'COMPLETED' && !order.rated && (
                    <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                        <Typography variant="body2" color="success.dark">
                            Order completed! Please rate your experience.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderTracker;
