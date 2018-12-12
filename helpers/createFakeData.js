const pointService = require('../services/point');
const userService = require('../services/user');
const subjectService = require('../services/subject');
const groupService = require('../services/group');
const CONSTANTS = require('../constants/index');

const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

module.exports = async function () {
    try {

        await userService.insertMany([
            {
                _id      : new ObjectId(),
                firstName: 'Vasil',

                lastName: 'Ignatovich',

                email: 'test@gmail.com',

                avatar: '6d6bad11-f833-446d-94fb-8d7e108ca296.jpeg',

                role: 10,

                password: '$2a$04$rd17nzFMTgDOHAAK06drWuHGXNP0ZmQf53WVk4qa.UsbCvVAQRhAy',
            },
            {
                _id      : ObjectId("5bd5ce5b94efe83c34358074"),
                firstName: 'Vasillisa',

                lastName: 'Ignatovich',

                email: 'test1@gmail.com',

                avatar: '6d6bad11-f833-446d-94fb-8d7e108ca296.jpeg',

                role: 10,

                password: '$2a$04$rd17nzFMTgDOHAAK06drWuHGXNP0ZmQf53WVk4qa.UsbCvVAQRhAy',
            },
            {
                _id      : ObjectId("5bccd229f4e7d42a18506cd6"),
                firstName: 'Petro',

                lastName: 'Ignatovich',

                email: 'test2@gmail.com',

                avatar: '6d6bad11-f833-446d-94fb-8d7e108ca296.jpeg',

                role: 10,

                password: '$2a$04$rd17nzFMTgDOHAAK06drWuHGXNP0ZmQf53WVk4qa.UsbCvVAQRhAy',
            },
            {
                _id      : ObjectId("5bba3a7fff1b4c3dec17672b"),
                firstName: 'Ihtvan',

                lastName: 'Ignatovich',

                email: 'test3@gmail.com',

                avatar: '6d6bad11-f833-446d-94fb-8d7e108ca296.jpeg',

                role: 5,

                password: '$2a$04$rd17nzFMTgDOHAAK06drWuHGXNP0ZmQf53WVk4qa.UsbCvVAQRhAy',
            }
        ]);

        await pointService.insertMany([
            {
                typeOfPoint: ObjectId("5c06b4c0822eaa0448b32056"),

                value: 50,

                student: ObjectId("5bccd229f4e7d42a18506cd6"),

                teacher: ObjectId("5bba3a7fff1b4c3dec17672b"),

                subject: ObjectId("5be202be23bea04028f8bde5")
            },
            {
                typeOfPoint: ObjectId("5c06b4c0822eaa0448b32057"),
                value      : 50,

                student: ObjectId("5bccd229f4e7d42a18506cd6"),

                teacher: ObjectId("5bba3a7fff1b4c3dec17672b"),

                subject: ObjectId("5be202be23bea04028f8bde5")
            },
            {
                typeOfPoint: ObjectId("5c06b4c0822eaa0448b32058"),
                value      : 50,

                student: ObjectId("5bccd229f4e7d42a18506cd6"),

                teacher: ObjectId("5bba3a7fff1b4c3dec17672b"),

                subject: ObjectId("5be202be23bea04028f8bde5")
            },
            {
                typeOfPoint: ObjectId("5c06b4c0822eaa0448b32058"),

                value: 50,

                student: ObjectId("5bd5ce5b94efe83c34358074"),

                teacher: ObjectId("5bba3a7fff1b4c3dec17672b"),

                subject: ObjectId("5be202be23bea04028f8bde5")
            },
            {
                typeOfPoint: ObjectId("5c06b4c0822eaa0448b32057"),
                value      : 50,

                student: ObjectId("5bd5ce5b94efe83c34358074"),

                teacher: ObjectId("5bba3a7fff1b4c3dec17672b"),

                subject: ObjectId("5be202be23bea04028f8bde5")
            },
            {
                typeOfPoint: ObjectId("5c06b4c0822eaa0448b32056"),
                value      : 50,

                student: ObjectId("5bd5ce5b94efe83c34358074"),

                teacher: ObjectId("5bba3a7fff1b4c3dec17672b"),

                subject: ObjectId("5be202be23bea04028f8bde5")
            }
        ]);

        await subjectService.insertMany([
            {
                _id    : ObjectId("5be202be23bea04028f8bde5"),
                name   : 'Mathematics',
                teacher: ObjectId("5bba3a7fff1b4c3dec17672b")
            },
            {
                _id    : new ObjectId(),
                name   : 'Algebra',
                teacher: ObjectId("5bba3a7fff1b4c3dec17672b")
            }
        ]);

        await groupService.insertMany([
            {
                name: 'P1',

                students: [
                    ObjectId("5bccd229f4e7d42a18506cd6"),
                    ObjectId("5bd5ce5b94efe83c34358074")
                ],

                subjects: [
                    ObjectId("5be202be23bea04028f8bde5")
                ]
            }
        ]);

        console.log('==== Data inserted successfully======');

    } catch (err) {
        console.error(err);
    }
};