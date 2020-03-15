class _Perlin {
    constructor() {
        this.HASH_LEN = 256
        this.LOOP = null

        this.gen_hashmap()
    }

    gen_hashmap() {
        this.HASHMAP = []
        for (var i = 0; i < this.HASH_LEN; i++)this.HASHMAP.push(Math.floor(Math.random() * this.HASH_LEN))
        this.HASHMAP.push(...this.HASHMAP)
    }

    get(x, y, z = 0) {
        if (this.LOOP > 0) {
            x %= this.LOOP
            y %= this.LOOP
            z %= this.LOOP
        }
        var [x, y, z] = [x, y, z].map(n => {
            n = n % this.HASH_LEN
            if (n < 0) n += this.HASH_LEN
            return n
        }),
            [x0, y0, z0] = [x, y, z].map(n => Math.floor(n) % this.HASH_LEN),
            [x, y, z] = [x, y, z].map(n => n % 1),
            [u, v, w] = [x, y, z].map(this._fade)

        // hash
        var tmp = [0, 1], hs = []
        for (var n1 of tmp) {
            var v1 = this._inc(x0, n1)
            for (var n2 of tmp) {
                var v2 = this._inc(y0, n2)
                v2 += this.HASHMAP[v1]
                for (var n3 of tmp) {
                    var v3 = this._inc(z0, n3)
                    hs[n1 * 4 + n2 * 2 + n3] = this.HASHMAP[this.HASHMAP[v2] + v3]
                }
            }
        }
        var res = (this._lerp(
            this._lerp(this._lerp(this._grad(hs[0], x, y, z), this._grad(hs[4], x - 1, y, z), u),
                this._lerp(this._grad(hs[2], x, y - 1, z), this._grad(hs[6], x - 1, y - 1, z), u), v),
            this._lerp(this._lerp(this._grad(hs[1], x, y, z - 1), this._grad(hs[5], x - 1, y, z - 1), u),
                this._lerp(this._grad(hs[3], x, y - 1, z - 1), this._grad(hs[7], x - 1, y - 1, z - 1), u), v),
            w) + 1) / 2
        if (res < 0) {
            console.log('this.hashmap', this.HASHMAP)
            console.log('input', x + x0, y + y0, z + z0)
        }
        return Math.max(0, res);
    }

    _grad(hash, x, y, z) {
        var h = hash & 15
        var u = h < 8 ? x : y
        var v = h < 4 ? y : (h == 12 || h == 14 ? x : z)
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v)
    }

    _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }

    _inc(n, add = 0) {
        if (add) {
            n++
            if (this.LOOP > 0) n %= this.LOOP
        }
        return n
    }

    _lerp(x, y, n) { return x + (y - x) * n }

}

window.Perlin = new _Perlin()
