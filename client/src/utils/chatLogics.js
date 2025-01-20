export const getSenders=(user , users)=>{
    return users[0]?._id === user?._id ? users[1]?.name : users[0]?.name;
}

export const getSendersFull=(user , users)=>{
    return users[0]?._id === user?._id ? users[1] : users[0]
}