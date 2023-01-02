class UserDto{
    _id;
    phone;
    activated;
    created;
    name;
    avatar

    constructor(user){
        this._id=user._id;
        this.phone=user.phone;
        this.activated=user.activated;
        this.created=user.createdAt;
        this.name=user.name;
        this.avatar=user.avatar?`${process.env.BASE_URL}${user.avatar}`:null;
    }
}

module.exports=UserDto;