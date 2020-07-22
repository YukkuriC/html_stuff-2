random = {
    next: function (a, b = null) {
        if (b == null) {
            b = a
            a = 0
        }
        return a + Math.floor(Math.random() * (b - a))
    }
}