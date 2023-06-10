import {Buffer} from 'buffer'

const convertBufferToBase64 =  (data) => {
 return new Buffer(data, 'base64').toString('binary');
}

export default convertBufferToBase64;
