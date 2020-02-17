export interface Message{
    _id:String,
    sendername:String,
    senderid:String,
    friendname:String,
    friendid:String,
    message:String,
    time:Date,
    read:boolean
}