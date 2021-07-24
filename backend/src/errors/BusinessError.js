class BusinessError extends Error {
    constructor(message) {
        super(message);
        this.name = "BusinessError";
    }
}

module.exports = BusinessError