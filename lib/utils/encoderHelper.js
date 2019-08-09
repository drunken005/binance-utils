const is = require("is_js");

// typeToTyp3
//amino type convert
const typeToTyp3 = (type) => {
    if (is.boolean(type)) {
        return 0
    }

    if (is.number(type)) {
        if (is.integer(type)) {
            return 0
        } else {
            return 1
        }
    }

    if (is.string(type) || is.array(type) || is.object(type)) {
        return 2
    }
}

const size = function (items, iter, acc) {
    if (acc === undefined) acc = 0
    for (var i = 0; i < items.length; ++i) acc += iter(items[i], i, acc)
    return acc
}

const isAbstractCodec = function (codec) {
    return (codec &&
        typeof codec.encode === "function" &&
        typeof codec.decode === "function" &&
        typeof codec.encodingLength === "function")
}


module.exports = {
    size,
    isAbstractCodec,
    typeToTyp3
}