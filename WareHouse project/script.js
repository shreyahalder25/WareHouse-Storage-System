const db = new Dexie("WarehouseDB");
db.version(1).stores({
  items:"id,productName,seller,price",
});
function showMessage(text, type){
  const messageDiv =document.getElementById("message");
  messageDiv.textContent=text;
  messageDiv.className=`${type} visible`;
  setTimeout(()=>{
    messageDiv.className="";
  },3000);
}
function validateFields(){
  const id =document.getElementById("id").value;
  const productName =document.getElementById("productName").value;
  const seller =document.getElementById("seller").value;
  const price =document.getElementById("price").value;
  if (!id || !productName || !seller || !price) {
    showMessage("All fields must be filled!", "error");
    return false;
  }
  return true;
}

function clearInputs(){
  document.getElementById("id").value ="";
  document.getElementById("productName").value ="";
  document.getElementById("seller").value ="";
  document.getElementById("price").value ="";
}

function createItem(){
  if(!validateFields()) return;
  const id=parseInt(document.getElementById("id").value);
  const productName=document.getElementById("productName").value;
  const seller=document.getElementById("seller").value;
  const price=parseFloat(document.getElementById("price").value);
  db.items.put({id,productName,seller,price }).then(()=>{
    showMessage("Item created successfully","success");
    displayItems();
    })
    .catch((error)=>showMessage(`Error: ${error}`,"error"));
  clearInputs();
}
function displayItems(){
  db.items.toArray().then((items)=>{
    const tableBody=document.getElementById("tableBody");
    tableBody.innerHTML=items.map((item)=>`
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.productName}</td>
                        <td>${item.seller}</td>
                        <td>${item.price}</td>
                        <td class="action-buttons">
                            <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                        </td>
                        <td class="action-buttons">
                            <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `
      ).join("");
  });
}
function readItems(){
    db.items.toArray().then((items)=>{
        const tableBody=document.getElementById("tableBody");
        tableBody.innerHTML=items.map((item)=>`
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.productName}</td>
                            <td>${item.seller}</td>
                            <td>${item.price}</td>
                            <td class="action-buttons">
                                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                            </td>
                            <td class="action-buttons">
                                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                            </td>
                        </tr>
                    `
          ).join("");
    }).then(()=>{
        showMessage("Items fetched successfully!","success");
    })
    .catch((error)=>showMessage(`Error: ${error}`,"error"));
}


function editItem(id){
  db.items.get(id).then((item)=>{
    document.getElementById("id").value=item.id;
    document.getElementById("productName").value=item.productName;
    document.getElementById("seller").value=item.seller;
    document.getElementById("price").value=item.price;
  });
}
function updateItem(){
  if(!validateFields()) return;
  const id=parseInt(document.getElementById("id").value);
  db.items
    .update(id,{
      productName:document.getElementById("productName").value,
      seller:document.getElementById("seller").value,
      price:parseFloat(document.getElementById("price").value),
    })
    .then(()=>{
      showMessage("Item updated successfully!","success");
      displayItems();
    })
    .catch((error)=>showMessage("Error: "+error,"error"));
  clearInputs();
}

function deleteItem(id){
  if(confirm("Are you sure you want to delete this item?")) {
    db.items
      .delete(id)
      .then(()=>{
        showMessage("Item deleted successfully!","success");
        displayItems();
      })
      .catch((error) =>showMessage("Error: "+ error,"error"));
  }
}
function deleteAll(){
  if(confirm("Are you sure you want to delete ALL items?")) {
    db.items.clear().then(() =>{
        showMessage("All items deleted successfully!","success");
        displayItems();
      })
      .catch((error)=>showMessage("Error: " + error,"error"));
  }
}
