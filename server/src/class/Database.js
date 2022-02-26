const sqlite3 = require("sqlite3");

module.exports = class Database {
    constructor(name, makerFunc, dbName = "./database.sqlite") {
        this.name = name;
        this.data = [];
        this.db = new sqlite3.Database(process.env.TEST_DATABASE || dbName);
        this.makerFunc = makerFunc;
    }

    getAll = next => {
        this.db.all(`SELECT * FROM ${this.name}`, (err, objs) => {
            next(err, objs);
        });
    }
   
    getById = (id, next = null) => {
        id = parseInt(id);
        for (let obj of this.data) {
            if (obj.id === id) {
                if (next) {
                    next(null, obj);
                    break;
                }
                return obj;
            }
        }
    }
    //Prend un array de ID
    getByIds = (ids) => {
        const results = [];
        for (let id of ids) {
          id = parseInt(id);
          this.getById(id, (err, word) => {
            results.push(word);
          });
        }
        return results;
      };

    add = (obj, next) => {
        this.db.run(
            SQLUtil.makeInsertSQL(this.name, obj),
            SQLUtil.makeValues(obj),
            (err) => {
                if (err) {
                    next(err);
                } else {
                    this.updateAll(next, err);
                }
            }
        );
    }

    update = (obj, next) => {
        this.db.run(
            SQLUtil.makeUpdateSQL(this.name, obj),
            SQLUtil.makeValues(obj),
            (err) => {
                if (err) {
                    next(err);
                } else {
                    this.updateAll(next, err);
                }
            }
        );
    }

    delete = (id, next) => {
        this.db.run(`DELETE FROM ${this.name} WHERE id = ${id}`, (err) => {
            this.updateAll(next, err);
        });
    }

    updateAll = (next = null, err = null) => {
        this.data = [];
        this.getAll((err, objs) => {
            if (!err) {
                for (let obj of objs) {
                    this.data.push(this.makerFunc(obj));
                }
            }
            if (next instanceof Function) {
                next(err, this.data);
            }
        });
    }
}