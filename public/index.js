// document.querySelector("form").addEventListener("submit", (event) => {
//     event.preventDefault();

//     const formData = new FormData(document.querySelector("form"));
//     const user = {}    
    
//     for (const [key, value] of formData) {
//         user[key] = value;
//       };
//       console.log(user);

//     sessionStorage.setItem("user-fwc", JSON.stringify(user));
//     window.location.assign("/chat");
// });