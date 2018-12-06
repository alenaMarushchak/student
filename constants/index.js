module.exports = {
    MODEL     : {
        USER      : 'User',
        GROUP     : 'Group',
        SUBJECT   : 'Subject',
        POINT_TYPE: 'PointType',
        POINT     : 'Point',
        BLOG      : 'Blog',
        POST      : 'Post',
        COMMENT   : 'Comment'
    },
    COLLECTION: {
        USERS      : 'Users',
        GROUPS     : 'Groups',
        SUBJECTS   : 'Subjects',
        POINT_TYPES: 'PointTypes',
        POINTS     : 'Points',
        BLOG       : 'BlogCollection',
        POSTS      : 'Posts',
        COMMENTS   : 'Comments'
    },

    ROLES: {
        ADMIN  : 1,
        STUDENT: 10,
        TEACHER: 5
    },

    VALIDATION: {
        SPEC_SYMBOLS: /[-[\]{}()*+?`"<>.,\\/^$|#\s]/g,
    },

    USERS: {
        SORT_FIELDS: ['name', 'role', 'email']
    },

    FILES: {
        BUCKETS: {
            TMP   : 'files/tmp',
            IMG   : 'files/img',
            VIDEO : 'files/video',
            AVATAR: 'files/avatars'
        },

        MIMETYPES: {
            IMG: ['image/jpeg', 'image/png'],
        },

        LIMITS: {
            FIVE_MB : 1024 * 1024 * 5,
            TEN_MB  : 1024 * 1024 * 10,
            FIFTY_MB: 1024 * 1024 * 50
        }
    },

    POINT_TYPES: {
        EXAM   : 'EXAM',
        MODULE1: 'MODULE1',
        MODULE2: 'MODULE2'
    }
};