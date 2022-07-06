const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
    // 채팅방 아이디
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room',
    },
    // 채팅을 한 사람
    user: {
        type: String,
        required: true,
    },
    // 채팅 내역
    chat: String,
    // 이미지 주소
    gif: String,
    // 채팅 시간
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chat', chatSchema);