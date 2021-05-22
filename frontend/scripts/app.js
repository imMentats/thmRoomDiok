// const notesContainer = document.getElementById("notes");
//
// const render = (state) => {
//     state.forEach(el => {
//         notesContainer.innerHTML +=
//             `
//                 <\div id="note--${el.id}" class="note col-12 col-md-3 m-1">
//                     <\h1\>${el.title}</\h1>
//                     <h2>${el.id}</h2>
//                     <\p\>${el.content}</\p>
//                     <style>
//                         #note--${el.id} {
//                         ${el.css}
//                         }
//                     </style>
//                 </\div>
//                 `
//     })
// }
// const XHR = new XMLHttpRequest();
// let apiServer = "http://127.0.0.1:3010"
// XHR.open("GET", `${apiServer}/notes`, false);
// try {
//     XHR.send();
//     if (XHR.status !== 200) {
//         alert("Error retrieving notes.")
//     } else {
//         let notes = JSON.parse(XHR.response)
//         render(notes);
//     }
// } catch (err) {
//     alert(err)
// }