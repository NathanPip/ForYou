import Parse from 'parse/dist/parse.min.js'

export const signIn = async (name) => {
    const query = new Parse.Query('user');
    query.equalTo('name', name)

    const user = await query.first();
    return user.json();
}

export const fetchMessages = async () => {
    const query = new Parse.Query('msgs');
    try {
    const msgs = await query.find();
    return msgs;
    } catch (err) {
        console.log(err.message)
    }
}

export const sendMessage = async (user, msg) => {
    let newMsg = new Parse.Object('msgs')
    newMsg.set('msg', msg);
    newMsg.set('msg_from', user)
    try {
        await newMsg.save();
        console.log('msg sent')
        return true;
    } catch (err) {
        console.log(err.message);
        return false;
    }
}