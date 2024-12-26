// ay dizisi
const months = [
    "January",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

// // html den ilgili elemanların çekilmesi 

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = document.querySelector("header p");
const closeIcon = document.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");

// console.log(addBox); 
// console.log(closeIcon);

// not güncellemesi için değişikenlerin oluşturulması 
let isUpdate = false;
let updateId;

// localStorage dan notları çekme 
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// ekle iconuna tıklayınca popup açılsın 
 addBox.addEventListener("click", () => {
     popupBoxContainer.classList.add("show");
     popupBox.classList.add("show");

    //  sayfa kaydırılmasını engelle 
     document.querySelector("body").style.overflow = "hidden";
     });

    //  kapat iconuna tıklayınca popup kapansın 
    closeIcon.addEventListener("click", () => {
        popupBoxContainer.classList.remove("show");
        popupBox.classList.remove("show");
        // sayfa kaydırılmasını aktif et 
        document.querySelector("body").style.overflow = "auto";
    });

    // not verisine erişme 
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // trim metoduyla boşlukları kaldırdık input ve textarea içerisisndeki değerlere eriştik  
        
        let titleInput = e.target[0];
        let descriptionInput = e.target[1];

        let title = titleInput.value.trim();
        let description = descriptionInput.value.trim();      

        // eğer title ve description varsa devam et 
        if (title && description) {
            // tarih verisine eriş 
            const date = new Date();
            let month = months[date.getMonth()];
            let day = date.getDate();
            let year = date.getFullYear();

            // not objesi oluştur 
            let noteInfo = {title, description, date: `${month} ${day}, ${year}` };
            // eğer düzenleme modundaysa notu güncelle değilse not ekle  
            if (isUpdate) {
                notes[updateId] = noteInfo;
                isUpdate = false;
             } else {
                notes.push(noteInfo);
             }
            
            
            
            
            // oluşan bu objeyi locale ekle 
            localStorage.setItem("notes", JSON.stringify(noteInfo));
            
            
            // popup ı kaldır 
            popupBoxContainer.classList.remove("show");
            popupBox.classList.remove("show");
            popupTitle.textContent = "Not Ekle";
            button.textContent = "Not Ekle";


            document.querySelector("body").style.overflow = "auto";
        }
        // Inputların içeriğini temizledik
         titleInput.value = "";
         descriptionInput.value = "";


        //  not eklendikten sonra notları render et 
         showNotes();   
    });

    // not silme özelliği 
    function deleteNote(noteId) {
       if (confirm("silmek istediğinizden emin msisiniz?")){
        // belirlenen notu not dizisinden kaldır 
        notes.splice(noteId, 1);
        // local storage ı güncelle 
        localStorage.setItem("notes", JSON.stringify(notes));
        // notları render et 
        showNotes();
       }
    }

    // note güncellemesi yapan fonksiyon 
    function updateNote(noteId, title, description) {
        isUpdate = true;
      updateId = noteId;
    //   popup ı görünür kıldık 
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");
    popupTitle.textContent = "Notu Güncelle";
    button.textContent = "Notu Güncelle";
    form.elements[0].value = title;
    form.elements[1].value = description;
  }

// menü içeriğini gösteren fonksiyon 
function showMenu(elem) {
    // parentElement bir elemanın kapsam elemanına erişmek için kullanılır burada tıklanan iconun kapsayıcısına bir class eklememiz gerektiğinden parentElement ile bu elemanın kapsayıcısına eriştik 
    // kapsam elemanına show clasını ekledik 
    elem.parentElement.classList.add('show');

    // menu harici bir yere tıklanırsa show classını kaldır 
    document.addEventListener("click", (e) => {
        // tıklanan eleman i etiketi değilse ya da kapsam elemanı eşit değilse show clasını kaldır buradaki I kullanımının sebebi tagName property sinin büyük harf olarak kabul edilmesidir 
        if (e.target.tagName!="I" || e.target != elem) {
         elem.parentElement.classList.remove("show");
        }
    });
}


// Not eklendikten sonra notları render et
function showNotes() {
    // eğer notlar yoksa fonksiyonu durdur 
   if(!notes) return;


//    önceden eklenen notu kaldır 
document.querySelectorAll('.note').forEach((li) => li.remove());


//    not dizisindeki her eleman için ekrana bir not kartı bastır 
notes.forEach((note, id) => {
   let liTag = ` <li class="note">
    <div class="details">
      <p>${note.title}</p>
      <span>${note.description}</span>
    </div>

    <div class="bottom-content">
      <span>${note.date}</span>
      <div class="settings">
        <i class="bx bx-dots-horizontal-rounded"></i>
        <ul class="menu">
          <li onclick='updateNote(${id}, "${note.title}", "${note.description}")'><i class="bx bx-edit"></i> Düzenle</li>
          <li onclick='deleteNote(${id})'><i class="bx bx-trash"></i> Sil</li>
        </ul>
      </div>
    </div>
  </li> `;
 
  addBox.insertAdjacentHTML('afterend', liTag);
});
}

// silme ve düzenleme işlemlerinin yapılabilmesi için bazı düzenlemeler 
// wrapper html den erişilen kapsam elemanıdır 
wrapper.addEventListener('click', (e) => {
 // eğer menu üç nokta iconuna tıklanırsa showmenu fonsiyonunu calıstır 
  if (e.target.classList.contains('bx-dots-horizontal-rounded')) {
    showMenu(e.target);
  }
//   eğer sil iconuna tıklandıysa deletenote fonk calıstır 
  if(e.target.classList.contains("bx-trash")) {
    // dataset bir elemana özellik atamaya yarar. bu örnekte id atadık 
    const noteId = parseInt(e.target.closest('.note').dataset.id, 10);
    deleteNote(noteId);
  }
  else if (e.target.classList.contains("bx-edit")) {
//    düzenleme işlemi yapılacak kapsam elemana eriş 
const noteElement = e.target.closest('.note');
const noteId = parseInt(noteElement.dataset.id, 10);
// title ve description değerlerine eriş 
const title = noteElement.querySelector('.details p');
const description = noteElement.querySelector('.details span');


updateNote(noteId, title, description);
}
});

document.addEventListener("DOMContentLoaded", () => showNotes());

// ! closest ve parenElement elemanların kapsayıcısına erişmek için kullanılır 
// closest direkt olarak erişilmek istenen elemanın özelliğini belirtmemizi 
// ister parentElement de ise tek tek kapsam elemana erişmemiz gerekir.


window.addEventListener('load', () => {
    // Sayfa yüklendiğinde localStorage'ı temizler
    localStorage.clear();
  });
  

