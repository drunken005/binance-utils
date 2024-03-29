/**
 * @module amino.encode
 */

const vstruct = require("varstruct");
const {Buffer} = require("safe-buffer");
const is = require("is_js");

const {UVarInt} = require("./varint");
const {typeToTyp3} = require("../utils/encoderHelper");
const {typePrefix} = require("../common");

const VarString = vstruct.VarString(UVarInt);

const sortObject = obj => {
    if (obj === null) return null
    if (typeof obj !== "object") return obj
    // arrays have typeof "object" in js!
    if (Array.isArray(obj))
        return obj.map(sortObject)
    const sortedKeys = Object.keys(obj).sort()
    const result = {}
    sortedKeys.forEach(key => {
        result[key] = sortObject(obj[key])
    })
    return result
}

/**
 * encode number
 * @param num
 */
const encodeNumber = (num) => UVarInt.encode(num)

/**
 * encode bool
 * @param b
 */
const encodeBool = (b) => b ? UVarInt.encode(1) : UVarInt.encode(0)

/**
 * encode string
 * @param str
 */
const encodeString = (str) => VarString.encode(str)

/**
 * encode time
 * @param value
 */
const encodeTime = (value) => {
    const millis = new Date(value).getTime()
    const seconds = Math.floor(millis / 1000)
    const nanos = Number(seconds.toString().padEnd(9, "0"))

    const buffer = Buffer.alloc(14)

    buffer[0] = (1 << 3) | 1 // field 1, typ3 1
    buffer.writeUInt32LE(seconds, 1)

    buffer[9] = (2 << 3) | 5 // field 2, typ3 5
    buffer.writeUInt32LE(nanos, 10)

    return buffer
}

/**
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
const convertObjectToSignBytes = obj =>
    Buffer.from(JSON.stringify(sortObject(obj)))

/**
 * js amino MarshalBinary
 * @param {Object} obj
 *  */
const marshalBinary = (obj) => {
    if (!is.object(obj))
        throw new TypeError("data must be an object")
    return encodeBinary(obj, -1, true).toString("hex")
}

/**
 * js amino MarshalBinaryBare
 * @param {Object} obj
 *  */
const marshalBinaryBare = (obj) => {
    if (!is.object(obj))
        throw new TypeError("data must be an object")

    return encodeBinary(obj).toString("hex")
}

/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} js data type (not null, not undefined)
 * @param {Number} field api of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
const encodeBinary = (val, fieldNum, isByteLenPrefix) => {
    if (val === null || val === undefined)
        throw new TypeError("unsupported type")

    if (Buffer.isBuffer(val)) {
        if (isByteLenPrefix) {
            return Buffer.concat([UVarInt.encode(val.length), val])
        }
        return val
    }

    if (is.array(val)) {
        return encodeArrayBinary(fieldNum, val, isByteLenPrefix)
    }

    if (is.number(val)) {
        return encodeNumber(val)
    }

    if (is.boolean(val)) {
        return encodeBool(val)
    }

    if (is.string(val)) {
        return encodeString(val)
    }

    if (is.object(val)) {
        return encodeObjectBinary(val, isByteLenPrefix)
    }

    return
}

/**
 * prefixed with bytes length
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
const encodeBinaryByteArray = (bytes) => {
    const lenPrefix = bytes.length
    return Buffer.concat([UVarInt.encode(lenPrefix), bytes])
}

/**
 *
 * @param {Object} obj
 * @return {Buffer} with bytes length prefixed
 */
const encodeObjectBinary = (obj, isByteLenPrefix) => {
    const bufferArr = []

    Object.keys(obj).forEach((key, index) => {
        if (key === "msgType" || key === "version") return
        if (isDefaultValue(obj[key])) return

        if (is.array(obj[key]) && obj[key].length > 0) {
            bufferArr.push(encodeArrayBinary(index, obj[key]))
        } else {
            bufferArr.push(encodeTypeAndField(index, obj[key]))
            bufferArr.push(encodeBinary(obj[key], index, true))
        }
    })

    let bytes = Buffer.concat(bufferArr)
    // add prefix
    if (obj.msgType && typePrefix[obj.msgType]) {
        const prefix = Buffer.from(typePrefix[obj.msgType], "hex")
        bytes = Buffer.concat([prefix, bytes])
    }

    // Write byte-length prefixed.
    if (isByteLenPrefix) {
        const lenBytes = UVarInt.encode(bytes.length)
        bytes = Buffer.concat([lenBytes, bytes])
    }
    return bytes
}

/**
 * @param {Number} fieldNum object field api
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
const encodeArrayBinary = (fieldNum, arr, isByteLenPrefix) => {
    const result = []

    arr.forEach((item) => {
        result.push(encodeTypeAndField(fieldNum, item))

        if (isDefaultValue(item)) {
            result.push(Buffer.from("00", "hex"))
            return
        }

        result.push(encodeBinary(item, fieldNum, true))
    })

    //encode length
    if (isByteLenPrefix) {
        const length = result.reduce((prev, item) => (prev + item.length), 0)
        result.unshift(UVarInt.encode(length))
    }

    return Buffer.concat(result)
}

// Write field key.
const encodeTypeAndField = (index, field) => {
    const value = (index + 1) << 3 | typeToTyp3(field);
    return UVarInt.encode(value)
}

const isDefaultValue = (obj) => {
    if (obj === null) return false

    return (is.number(obj) && obj === 0)
        || (is.string(obj) && obj === "")
        || (is.array(obj) && obj.length === 0)
}


module.exports = {
    encodeNumber,
    encodeBool,
    encodeString,
    encodeTime,
    convertObjectToSignBytes,
    marshalBinary,
    marshalBinaryBare,
    encodeBinary,
    encodeBinaryByteArray,
    encodeObjectBinary,
    encodeArrayBinary,
}