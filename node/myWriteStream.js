const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');

class WriteStream extends EventEmitter {
    constructor(path, opts) {
        super();
        this.path = path;
        this.flags = opts.flags || 'w';
        this.enconding = opts.enconding || 'utf8';
        this.emitClose = opts.emitClose || true;
        this.start = opts.start || 0;
        this.highWaterMark = opts.highWaterMark || 16 * 1024;

        this.isWriting = false; //默认不是正在写入

        this.len = 0; //当前写入的长度

        //第一次调用write的时候需要执行fs.write方法

        this.needDrain = false;
        this.offset = 0;

        this.cache = []; //除了第一次是写入到文件外，后面的写入都在内存中排队
        this.open();

    }
    destroy(err) {
        if (err) {
            this.emit('error', err);
        }
    }
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) this.destroy(err);
            this.fd = fd;
            this.emit('open', fd)
        })
    }
    /**
     * 清空缓存
     */
    clearBuffer() {
        //data = [ { chunk: <Buffer 31>, enconding: 'utf8', cb: [Function: cb] } ]
        let data = this.cache.shift(); //
        if (data) {
            this._write(data.chunk, data.enconding, data.clearBuffer);
        } else {
            this.isWriting = false;
            if (this.needDrain) {
                this.needDrain = false;
                this.emit('drain');
            }
        }
    }
    /**
     * 
     * @param {*} chunk  要写入的到文件的内容
     * @param {*} enconding 
     * @param {*} cb 
     */
    write(chunk, enconding = this.enconding, cb = () => { }) {

        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);

        this.len += chunk.length;

        let result = this.len < this.highWaterMark;
        this.needDrain = !result;
        const clearBuffer = () => {
            this.clearBuffer();
            cb();
        }

        //如果正在写入，那么先把后面要写入的内容都缓存到内存中
        if (this.isWriting) {
            this.cache.push({ chunk, enconding, clearBuffer })
        }
        else {
            this.isWriting = true;
            this._write(chunk, enconding, clearBuffer);
        }

        return result;
    }
    _write(chunk, enconding, cb) {
        //绑定事件，监听open
        if (typeof this.fd !== 'number') {
            return this.once('open', () => {
                this._write(chunk, enconding, cb);
            });
        }
        console.log('this.fd =', this.fd, 'this.cache=', this.cache);
        fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
            if (err) this.destroy(err);
            this.offset += written;
            this.len -= written;
            cb();
        });
    }
    end(str) {
        this.end(str);
    }
}

exports = module.exports = WriteStream;