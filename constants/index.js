module.exports = {
    MODEL: {
        USER: 'User',
        GROUP: 'Group',
        SUBJECT: 'Subject'
    },
    COLLECTION: {
        USERS: 'Users',
        GROUPS: 'Groups',
        SUBJECTS: 'Subjects'
    },

    ROLES: {
        ADMIN: 1,
        STUDENT: 10,
        TEACHER: 5
    },

    FILES: {
        BUCKETS: {
            TMP   : 'files/tmp',
            IMG   : 'files/img',
            VIDEO : 'files/video',
            AVATAR: 'files/avatars'
        },

        MIMETYPES: {
            IMG  : ['image/jpeg', 'image/png'],
        },

        LIMITS: {
            FIVE_MB : 1024 * 1024 * 5,
            TEN_MB  : 1024 * 1024 * 10,
            FIFTY_MB: 1024 * 1024 * 50
        }
    },
};