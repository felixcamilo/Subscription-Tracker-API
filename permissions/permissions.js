

export const checkAdminPermission = (role) => {
    if (role !== 'admin') {
        throw new Error("Only the admin has permission to perform this action");
    }
}


export const checkOwnerPermission = (subscriptionUserId, currentUserId) => {

    if (subscriptionUserId !== currentUserId) {
        throw new Error("Only the subscription owner have permission to perform this action");
    }
}


export const checkAdminOrOwnerPermission = (role, currentUserId, paramsId) => {
    if (role !== 'admin') {
        if (currentUserId !== paramsId) {
            throw new Error("Only the admin or current logged in user have permission to perform this action");
        }
    }
}