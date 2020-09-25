exports.emulateFlash = function (req, res, next) {
    req.flash = (type, message) => {
        return res.status(403).send({ error: true, message });
    }
    next();
}