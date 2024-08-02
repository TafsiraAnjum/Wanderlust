// to handle all type of errors of routes
module.exports = (fnc) => {
    return (req, res, next) => {
        fnc(req, res, next).catch(next);
    }
}