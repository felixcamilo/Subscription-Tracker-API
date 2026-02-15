

export const checkAdminPermission = (req) => {
    if (req.user.role !== 'admin') {

        const error = new Error("Only the admin has permission to perform this action");
        error.statusCode = 403;
        throw error;
    }
}

export const checkSubscriptionOwnership = (subscription, req) => {
    if (subscription.user.toString() !== req.user.id) {
        const error = new Error("You do not have permission to perform this action");
        error.statusCode = 403;
        throw error;    }
}
