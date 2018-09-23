class SuperService {

    constructor(model) {
        this.model = model;
    }

    save(body, cb) {
        const model = new this.model(body);

        if (!cb) {
            return model.save();
        }

        model.save((err, userModel) => cb(err, userModel));
    }

    create(objects, cb) {
        if (!cb) {
            return this.model.create(objects);
        }

        this.model.create(objects, err => cb(err));
    }

    insertMany(docs) {
        return this.model.insertMany(docs);
    }

    count(...args) {
        return this.model.count(...args);
    }

    aggregate(params) {
        return this.model.aggregate(params);
    }

    aggregateOne(params) {
        return this.model.aggregate(params).then(([result]) => result);
    }

    find(...args) {
        return this.model.find(...args);
    }

    findOne(...args) {
        return this.model.findOne(...args);
    }

    findById(...args) {
        return this.model.findById(...args);
    }

    update(...args) {
        return this.model.update(...args);
    }

    updateById(...args) {
        const _id = args[0];

        args[0] = {_id};

        return this.update(args);
    }

    findByIdAndUpdate(...args) {
        return this.model.findByIdAndUpdate(...args);
    }

    findOneAndUpdate(...args) {
        return this.model.findOneAndUpdate(...args);
    }

    remove(...args) {
        return this.model.remove(...args);
    }

    removeById(...args) {
        const _id = args[0];

        args[0] = {_id};

        return this.remove(...args);
    }

    findByIdAndRemove(...args) {
        return this.model.findByIdAndRemove(...args);
    }

    findOneAndRemove(...args) {
        return this.model.findOneAndRemove(...args);
    }
}

module.exports = SuperService;
