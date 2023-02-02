const socket = io();
const user = {}

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

if (!params) {
    disconnectUser();
};

for (const [key, value] of params) {
    user[key] = value;
};

if (!user) {
    window.location.replace("/");
};

document.querySelector("#group-name").innerText = "grupo de " + user.room

socket.emit("selectedRoom", user, (messagesInRoom) => {
    messagesInRoom.forEach(message => renderMessage(message));
});

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target.children[0].value

    if(!message) {
        return
    }

    socket.emit("message", message)
    
    document.querySelector("form").reset();
});

socket.on("message", (message) => {
    renderMessage(message)
});

function renderMessage({username, room, bio, isOnline, content, createdAt}){
    const wrapperChat = document.querySelector("#messages");

    const chat = document.createElement("div");
    const statusUser = document.createElement("span");
    const contentMessage = document.createElement("p");
    const statusMessage = document.createElement("span");
    const popover = document.createElement("div");
    const contentPopover = document.createElement("p");

    chat.classList = "flex flex-col items-start gap-1 relative group transition-all";
    statusUser.classList = "flex items-center justify-center gap-1 text-light-gray text-sm font-bold before:block before:h-2 before:w-2 before:mt-[2px] before:rounded-full cursor-default";
    statusUser.id = "user-message-" + username;
    popover.classList= "invisible group-active:visible absolute top-2 p-4 bg-black/90 rounded-xl text-light-gray"
    contentMessage.classList = "w-max max-w-[50%] p-4 text-light-gray rounded-br-lg rounded-bl-lg break-all text-left";
    statusMessage.classList = "text-light-gray text-sm"

    if(username === user.username) {
        statusUser.classList.add("self-end");
        popover.classList.add("right-5")
        contentMessage.classList.add("self-end", "bg-water", "rounded-tl-lg");
        statusMessage.classList.add("self-end");
    } else {
        statusUser.classList.add("self-start", "flex-row-reverse");
        popover.classList.add("left-0")
        contentMessage.classList.add("self-start", "bg-purple", "rounded-tr-lg");
        statusMessage.classList.add("self-start");
    };

    statusUser.innerText = username
    contentMessage.innerText = content;
    statusMessage.innerText = dayjs(createdAt).format("HH:mm")
    contentPopover.innerText = bio;

    popover.appendChild(contentPopover);
    chat.append(statusUser, popover, contentMessage, statusMessage);
    wrapperChat.appendChild(chat);

    document.querySelector("#messages").scrollTo(0, document.querySelector("#messages").scrollHeight)
}

document.querySelector("#logout").addEventListener("click", () => {
    disconnectUser();
})

function disconnectUser() {
    socket.emit("userDisconnect", user);
    socket.disconnect();

    window.localStorage.removeItem("user-chat-message");
    window.location.replace("/");
}

socket.on("userStatus", (users) => {
    users.forEach(user => {
        const statusUser = document.querySelectorAll("#user-message-" + user.username);
        statusUser.forEach(status => {
            if(user.isOnline) {
                status.classList.add("before:bg-[#00B37E]");
            } else {
                status.classList.add("before:bg-gray-800");
            };    
        })
    });
});