

export const checkAdminPermission = (role) => {
    if (role !== 'admin') {
        throw new Error("Only the admin has permission to perform this action");
    }
}